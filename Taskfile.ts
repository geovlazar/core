// see Taskfile.ts setup and usage instructions in $RF_HOME/lib/task/README.md

// governance:
// * use natural Deno modules for tasks, only use Taskfile.ts as wrapper
// * be cross-platform and don't introduce dependencies unless necessary
// * use dzx whenever possible for exiting to shell, support Windows too

// TODO:
// -[ ] preparePublish might generate updated assets but it's being called in
//      Git pre-push hook; test what happens and see if we should stop the push
//      in case artifacts need to be stages/committed?
// -[ ] see what's reusable across projects and put them into $RF_HOME/lib/task

import {
  dzx,
  rflDenoConfigHelpers as dch,
  rflDepsHelpers as depsH,
  rflDoctorTask as dt,
  rflGitHubTask as gh,
  rflGitTask as git,
  rflShellTask as sht,
  rflSQLa as SQLa,
  rflTask as t,
  rflTaskUDD as udd,
} from "./deps.ts";
import * as mod from "./mod.ts";

type SandboxAsset = {
  depsTs: string;
  isSandbox: () => boolean;
  plantUML: {
    gitHubDownloadDestPath: string;
    jarFileNameOnly: string;
    localJarPathAndName: string;
  };
};

const rfDepsMutator = await depsH.resFactoryDepsMutator(
  Deno.cwd(),
  (d) => d.found.pathRelative(Deno.cwd()),
  {
    onSrcNotFound: {
      gitHub: {
        // deno-lint-ignore require-await
        prepareSandbox: async (d, depsTs) => {
          // deno-fmt-ignore
          console.log(`Unsable to mutate ${depsTs} for sandbox:`, d.searchGlob, "not found in", d.startSearchInAbsPath);
        },
        // deno-lint-ignore require-await
        prepareRemote: async (d, depsTs) => {
          // deno-fmt-ignore
          console.log(`Unsable to mutate ${depsTs} for remote:`, d.searchGlob, "not found in", d.startSearchInAbsPath);
        },
      },
    },
  },
);

/**
 * Download and cache all project dependencies (such as plantuml.jar).
 * @param sandbox sandbox config vars
 * @returns nothing
 */
export function ensureProjectDeps(sandbox: SandboxAsset) {
  return async () => {
    const options = { verbose: true };
    await gh.ensureGitHubBinary({
      // Take latest plantuml-${releaseTag}.jar like plantuml-1.2022.6.jar from
      // https://github.com/plantuml/plantuml and place it into support/bin/plantuml.jar.
      // Use `java -jar support/bin/plantuml.jar -version` to see which version it is
      repo: "plantuml/plantuml",
      destPath: sandbox.plantUML.gitHubDownloadDestPath,
      release: {
        baseName: (latest) => `plantuml-${latest.tag_name.substring(1)}.jar`,
        finalize: async (fsPath) => {
          await Deno.rename(
            fsPath,
            sandbox.plantUML.localJarPathAndName,
          );
          return undefined; // no further finalization required
        },
      },
    }, options)();
  };
}

function* doctorCategories(sandbox: SandboxAsset) {
  yield dt.doctorCategory("Build dependencies", function* () {
    yield {
      // deno-fmt-ignore
      diagnose: async (report) => {
        report({ expectText: (await dzx.$e`dot -V`).split("\n")[0], textNotFound: "graphviz dot not found in PATH, install it" });
        report({ expectText: (await dzx.$o`java --version`).split("\n")[0], textNotFound: "java not found in PATH, install it" });
        report({ expectText: (await dzx.$o`java -jar ${sandbox.plantUML.localJarPathAndName} -version`).split("\n")[0], textNotFound: `${sandbox.plantUML.jarFileNameOnly} not found, use Taskfile.ts ensure-project-deps to download from GitHub` });
      },
    };
  });
}

export class Tasks extends t.EventEmitter<{
  init(): Promise<void>; // setup .githooks and any other initialization
  help(): void;
  doctor(): Promise<void>; // test that all dependencies are available
  ensureProjectDeps(): Promise<void>; // download binaries from sources
  updateDenoDeps(): Promise<void>;
  updateDenoConfig(): Promise<void>; // contribute Taskfile.ts tasks, etc. to deno.jsonc
  maintain(): Promise<void>;
  generateModelsDocs(): Promise<void>;
  prepareSandbox(): Promise<void>; // -- replace deps.* with local Resource Factory locations
  preparePublish(): Promise<void>; // -- replace deps.* with remote RF locations, TODO: tag, and push to remote
  gitHookPrepareCommitMsg(): Promise<void>; // called by .git/hooks/prepare-commit-msg
  gitHookPreCommit(): Promise<void>; // called by .git/hooks/pre-commit
  gitHookPrePush(): Promise<void>; // called by .git/hooks/pre-push
  shellContribs(): Promise<void>;
}> {
  constructor(
    readonly config: {
      readonly sandbox: SandboxAsset;
    },
  ) {
    super();

    const { sandbox } = config;

    this.on("help", t.eeHelpTask(this));
    this.on("updateDenoDeps", udd.updateDenoDepsTask());
    this.on("ensureProjectDeps", ensureProjectDeps(sandbox));
    this.on("maintain", async () => {
      await this.emit("ensureProjectDeps");
      await this.emit("updateDenoDeps");
    });

    const denoCfg = dch.denoConfigHelpers();
    this.on("updateDenoConfig", denoCfg.persistTaskAdapters(this));

    const gt = git.gitTasks({
      hooks: {
        "prepareCommitMsg": git.prepareCommitMsgGitHook(),
        "preCommit": git.preCommitGitHook({
          sandboxGuard: {
            // deno-lint-ignore require-await
            isSandboxDeps: async () => {
              // deno-fmt-ignore
              if (rfDepsMutator.isSandbox(sandbox.depsTs)) {
                return [100, "☢️  Sandbox resFactory URLs in deps.ts, cannot commit unless remotes are used."];
              }
              return false;
            },
          },
        }),
        "prePush": git.gitHookIntegration("prePush", async () => {
          await this.emit("generateModelsDocs");
          return 0; // always successful
        }),
      },
    });
    this.on("init", gt.init);
    gt.registerHooks(this);

    const shTasks = sht.shellTasks({
      integrationMarkerEV: "OPSFOLIO_SHELL_INTEGRATION",
    });
    this.on("shellContribs", shTasks.shellContribs);

    // deno-lint-ignore no-this-alias
    const eeThis = this;
    this.on(
      "doctor",
      dt.doctor(function* () {
        yield dt.doctorCategory("Git dependencies", function* () {
          yield { diagnose: gt.doctor };
        });
        yield dt.doctorCategory("Runtime dependencies", function* () {
          yield* dt.denoDoctor().diagnostics();
          yield { diagnose: denoCfg.doctor(eeThis) };
          yield {
            diagnose: rfDepsMutator.doctor("resFactory", sandbox.depsTs),
          };
        });
        yield* doctorCategories(sandbox);
        yield dt.doctorCategory("Shell integration", function* () {
          yield { diagnose: shTasks.doctor };
        });
      }),
    );

    this.on("generateModelsDocs", async () => {
      const models = mod.models(SQLa.typicalSqlTextSupplierOptions());
      const ctx = SQLa.typicalSqlEmitContext();
      await Deno.writeTextFile(
        "support/docs/models.sql",
        models.seedDDL.SQL(ctx),
      );

      const pumlDestFile = "support/docs/models.puml";
      const puml = models.plantUmlIE(SQLa.typicalSqlEmitContext(), "models");
      await Deno.writeTextFile(pumlDestFile, puml);
      await dzx
        .$`java -jar ${sandbox.plantUML.localJarPathAndName} -svg ${pumlDestFile}`;
    });

    this.on(
      "prepareSandbox",
      async () => await rfDepsMutator.gitHub.prepareSandbox(sandbox.depsTs),
    );
    this.on("preparePublish", async () => {
      await this.emit("generateModelsDocs");
      await rfDepsMutator.gitHub.prepareRemote(sandbox.depsTs);
    });
  }
}

// only execute tasks if Taskfile.ts is being called as a script; otherwise
// it might be imported for tasks or other reasons and we shouldn't "run".
if (import.meta.main) {
  await t.eventEmitterCLI(
    Deno.args,
    new Tasks({
      sandbox: {
        depsTs: "deps.ts",
        isSandbox: () => rfDepsMutator.isSandbox("deps.ts"),
        plantUML: {
          jarFileNameOnly: "plantuml.jar",
          gitHubDownloadDestPath: "support/bin",
          localJarPathAndName: "support/bin/plantuml.jar",
        },
      },
    }),
  );
}
