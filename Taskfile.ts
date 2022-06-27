import {
  dzx,
  rflGitHubTask as gh,
  rflSQLa as SQLa,
  rflTask as t,
  rflTaskUDD as udd,
} from "./deps.ts";
import * as mod from "./mod.ts";

type SandboxAsset = {
  depsTs: string;
  resFactoryTag: () => Promise<string>;
  plantUML: {
    gitHubDownloadDestPath: string;
    jarFileNameOnly: string;
    localJarPathAndName: string;
  };
};

// deno-lint-ignore require-await
async function isResFactoryDepsLocal(sb: SandboxAsset) {
  const origDepsTs = Deno.readTextFileSync(sb.depsTs);
  return origDepsTs.indexOf('"../../resFactory/factory/') > 0;
}

/**
 * Instead of using multiple import maps, mutate the local deps.ts to point to
 * an appropriate set of https://github.com/resFactory/factory modules.
 * When local (mGit path conventions): ../../../github.com/resFactory/factory*
 * when remote (latest): https://raw.githubusercontent.com/resFactory/factory/main*
 * when remote (pinned): https://raw.githubusercontent.com/resFactory/factory/${tag}*
 * @param sb the sandbox asset locations
 * @param prepare whether we're pointing to resFactory in local sandbox or publish (GitHub) location
 */
async function mutateResFactoryDeps(
  sb: SandboxAsset,
  prepare: "sandbox" | "publish",
) {
  const origDepsTs = Deno.readTextFileSync(sb.depsTs);
  const mutatedDepsTs = prepare == "sandbox"
    ? origDepsTs.replaceAll(
      /"https:\/\/raw.githubusercontent.com\/resFactory\/factory\/.*?\//g,
      `"../../resFactory/factory/`,
    )
    : origDepsTs.replaceAll(
      '"../../resFactory/factory/',
      `"https://raw.githubusercontent.com/resFactory/factory/${await sb
        .resFactoryTag()}/`,
    );
  if (mutatedDepsTs != origDepsTs) {
    await Deno.writeTextFile(sb.depsTs, mutatedDepsTs);
  }
}

function gitHookPreCommit(_tasks: Tasks, sandbox: SandboxAsset) {
  return async () => {
    const verbose = $.verbose;
    $.verbose = true;
    const commitList = await $o
      `git diff --cached --name-only --diff-filter=ACM`;
    const commitFileNames = commitList.split("\n");
    console.log(
      `Running pre-commit checks in Taskfile.ts from ${
        Deno.env.get("GITHOOK_SCRIPT")
      } for ${commitFileNames.join(", ")}`,
    );
    if (
      commitFileNames.find((fn) => fn == sandbox.depsTs) &&
      await isResFactoryDepsLocal(sandbox)
    ) {
      console.log(
        `resFactory/factory URLs are local, cannot commit ${sandbox.depsTs}`,
      );
      Deno.exit(100);
    }
    await $`deno fmt`;
    await $`deno lint`;
    await $`deno test -A --unstable`;
    $.verbose = verbose;
  };
}

function gitHookPrePush(tasks: Tasks, _sandbox: SandboxAsset) {
  return async () => {
    const verbose = $.verbose;
    $.verbose = true;
    await tasks.emit("preparePublish");
    $.verbose = verbose;
  };
}

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

export function doctor(sandbox: SandboxAsset) {
  // deno-fmt-ignore
  return async () => {
    console.info($.dim(`Runtime dependencies`));
    console.info($.yellow(`  * ${(await $o`deno --version`).split("\n")[0]}`));
    console.info($.dim(`Build dependencies`));
    const dot = await dzx.$e`dot -V`;
    const java = await dzx.$o`java --version`;
    const plantUML = await dzx.$o
      `java -jar ${sandbox.plantUML.localJarPathAndName} -version`;
    console.info(`  * ${dot.split("\n")[0] || "graphviz dot not found in PATH, install it"}`);
    console.info(`  * ${java.split("\n")[0] || "java not found in PATH, install it"}`);
    console.info(`  * ${plantUML.split("\n")[0] || `${sandbox.plantUML.jarFileNameOnly} not found, use Taskfile.ts ensure-project-deps to download from GitHub`}`);
  };
}

// see setup and usage instructions in $RF_HOME/lib/task/README.md

// governance:
// * use natural Deno modules for tasks, only use Taskfile.ts as wrapper
// * be cross-platform and don't introduce dependencies unless necessary
// * use dzx whenever possible for exiting to shell, support Windows too

export class Tasks extends t.EventEmitter<{
  help(): void;
  doctor(): Promise<void>; // test that all dependencies are available
  ensureProjectDeps(): Promise<void>; // download binaries from sources
  updateDenoDeps(): Promise<void>;
  maintain(): Promise<void>;
  generateModelsDocs(): Promise<void>;
  prepareSandbox(): Promise<void>; // -- replace deps.* with local Resource Factory locations
  preparePublish(): Promise<void>; // -- replace deps.* with remote RF locations, TODO: tag, and push to remote
  populateGitHooks(): Promise<void>; // -- add git pre-commit / pre-push hooks for
  gitHookPreCommit(): Promise<void>; // called by .git/hooks/pre-commit to ensure deno lint/fmt/etc.
  gitHookPrePush(): Promise<void>; // called by .git/hooks/pre-push to ensure deps.ts is not pointing to local
  // TODO: shellContribs(): Promise<void>; // -[ ] generate ("contribute") aliases, env vars, CLI completions, etc. useful for shells
  //                                               using shell-contribs should eliminate need for custom shells, etc. like
  //                                               github.com/netspective-studios/home-creators and allow generic shells to be used
  //                                          -[ ] auto-detect bash and zsh and generate proper shell contributions
  //                                          -[ ] alias path-task
  //                                          -[ ] git semver in support/bin
}> {
  constructor(
    readonly config: {
      readonly sandbox: SandboxAsset;
    },
  ) {
    super();

    const { sandbox } = config;

    // housekeeping tasks
    this.on("help", t.eeHelpTask(this));
    this.on("doctor", doctor(sandbox));
    this.on("gitHookPreCommit", gitHookPreCommit(this, sandbox));
    this.on("gitHookPrePush", gitHookPrePush(this, sandbox));
    this.on("updateDenoDeps", udd.updateDenoDepsTask());
    this.on("ensureProjectDeps", ensureProjectDeps(sandbox));
    this.on("maintain", async () => {
      await this.emit("ensureProjectDeps");
      await this.emit("updateDenoDeps");
    });

    this.on("generateModelsDocs", async () => {
      const models = mod.models();
      const ctx = SQLa.typicalSqlEmitContext();
      await Deno.writeTextFile(
        "support/docs/models.sql",
        models.seedDDL.SQL(ctx),
      );

      const pumlDestFile = "support/docs/models.puml";
      const puml = models.plantUmlIE(SQLa.typicalSqlEmitContext(), "models");
      await Deno.writeTextFile(pumlDestFile, puml);
      dzx.$
        `java -jar ${sandbox.plantUML.localJarPathAndName} -svg ${pumlDestFile}`;
    });

    this.on(
      "prepareSandbox",
      async () => await mutateResFactoryDeps(sandbox, "sandbox"),
    );
    this.on("preparePublish", async () => {
      await this.emit("generateModelsDocs");
      await mutateResFactoryDeps(sandbox, "publish");
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
        resFactoryTag: async () =>
          await gh.latestGitHubRepoTag({ repo: "resFactory/factory" }, "main"),
        plantUML: {
          jarFileNameOnly: "plantuml.jar",
          gitHubDownloadDestPath: "support/bin",
          localJarPathAndName: "support/bin/plantuml.jar",
        },
      },
    }),
  );
}
