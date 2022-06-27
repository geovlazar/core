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

/**
 * Sets up .githooks/* as the location for this project's Git hooks.
 * @param _tasks the task runner
 * @param _sandbox sandbox config vars
 * @returns a function that can be used by Tasks event emitter
 */
function init(_tasks: Tasks, _sandbox: SandboxAsset) {
  return async () => {
    const verbose = $.verbose;
    $.verbose = true;
    await $`git config core.hooksPath .githooks`;
    $.verbose = verbose;
  };
}

/**
 * Test to see if any of the imports in deps.ts contains relative paths URIs
 * such as ../resFactory/factory/. If so, it means that the deps.ts refers to
 * "local" Resource Factory modules.
 * @param sb the sandbox asset locations
 * @returns true if deps.ts refers to "local" Resource Factory modules, false if refers to remotes
 */
// deno-lint-ignore require-await
async function isResFactoryDepsLocal(sb: SandboxAsset) {
  const origDepsTs = Deno.readTextFileSync(sb.depsTs);
  return origDepsTs.indexOf("../resFactory/factory/") > 0;
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

/**
 * Called from .githooks/pre-commit to run commit message checks; be sure to use
 * Taskfile.ts init at least once in the cloned repo to use.
 * @param _tasks the task runner
 * @param _sandbox sandbox config vars
 * @returns a function that can be used by Tasks event emitter
 */
function gitHookPrepareCommitMsg(_tasks: Tasks, _sandbox: SandboxAsset) {
  // deno-lint-ignore require-await
  return async () => {
    // From: https://dev.to/craicoverflow/enforcing-conventional-commits-using-git-hooks-1o5p
    // Build the Regular Expression Options.
    const types =
      "build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test";
    const scopeMinLen = 1;
    const scopeMaxLen = 16;
    const scopeRegEx = `[a-z0-9_.-]{${scopeMinLen},${scopeMaxLen}}`;
    const subjectMinLen = 4;
    const subjectMaxLen = 120;
    const subjectRegEx = `[a-z0-9_. -]{${subjectMinLen},${subjectMaxLen}}`;

    //# Build the Regular Expression String.
    const commitHeadRegEx = new RegExp(
      `^(revert: )?(${types})(\(${scopeRegEx}\))?!?: ${subjectRegEx}[^.]{1,}$`,
    );

    const commitMsgHead = Deno.env.get("GITHOOK_COMMITMSG_HEAD");
    if (commitMsgHead && commitMsgHead.trim().length > 0) {
      //deno-fmt-ignore
      if(!commitHeadRegEx.test(commitMsgHead)) {
        console.info($.red("The commit message was not formatted correctly. Rejecting the commit request."));
        console.info($.dim(" - https://www.conventionalcommits.org/en/v1.0.0/"));
        console.info($.dim(" - https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional\n"));
        console.info($.dim(" Having trouble with the format? Just not sure of how to commit correctly? https://commitlint.io/"));
        console.info($.dim(" Something else happening? Use https://regexr.com/ with the following expression to validate your commit."));
        console.info($.dim(`  - RegEx: /${commitHeadRegEx}/`));
        Deno.exit(101);
      }
    } else {
      //deno-fmt-ignore
      console.info($.red("No commit message supplied. Rejecting the commit request."));
      Deno.exit(102);
    }
    console.log($.dim("Commit message checks passed, allowing commit."));
  };
}

/**
 * Called from .githooks/pre-commit to run checks before allowing commit; be
 * sure to use Taskfile.ts init at least once in the cloned repo to use.
 * @param _tasks the task runner
 * @param sandbox sandbox config vars
 * @returns a function that can be used by Tasks event emitter
 */
function gitHookPreCommit(_tasks: Tasks, sandbox: SandboxAsset) {
  return async () => {
    const verbose = $.verbose;
    const commitList = (await $o`git diff --cached --name-only`).split("\n");
    $.verbose = true;
    console.log(
      `Running pre-commit checks in Taskfile.ts from ${
        Deno.env.get("GITHOOK_SCRIPT")
      } for ${commitList.join(", ")}`,
    );
    if (
      commitList.find((fn) => fn == sandbox.depsTs) &&
      await isResFactoryDepsLocal(sandbox)
    ) {
      console.error(
        $.brightRed(
          `resFactory/factory URLs are local, cannot commit ${sandbox.depsTs}`,
        ),
      );
      console.log($.green("run Taskfile.ts prepare-publish before commit"));
      Deno.exit(100);
    }
    await $`deno fmt`;
    await $`deno lint`;
    await $`deno test -A --unstable`;
    console.log($.dim("Pre-commit checks passed, allowing commit."));
    $.verbose = verbose;
  };
}

/**
 * Called from .githooks/pre-push to run checks before allowing remote push; be
 * sure to use Taskfile.ts init at least once in the cloned repo to use.
 * @param tasks the task runner
 * @param _sandbox sandbox config vars
 * @returns a function that can be used by Tasks event emitter
 */
function gitHookPrePush(tasks: Tasks, _sandbox: SandboxAsset) {
  return async () => {
    const verbose = $.verbose;
    $.verbose = true;
    await tasks.emit("preparePublish");
    $.verbose = verbose;
    console.log($.dim("Pre-push checks passed, proceeding with push."));
  };
}

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

export function doctor(sandbox: SandboxAsset) {
  // deno-fmt-ignore
  return async () => {
    console.info($.dim(`Git repo configuration`));
    console.info($.yellow(`  * ${await $o`git config core.hooksPath` == ".githooks" ? '.githooks setup properly' : '.githooks not setup properly, run Taskfile.ts init'}`));
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

export class Tasks extends t.EventEmitter<{
  init(): Promise<void>; // setup .githooks and any other initialization
  help(): void;
  doctor(): Promise<void>; // test that all dependencies are available
  ensureProjectDeps(): Promise<void>; // download binaries from sources
  updateDenoDeps(): Promise<void>;
  maintain(): Promise<void>;
  generateModelsDocs(): Promise<void>;
  prepareSandbox(): Promise<void>; // -- replace deps.* with local Resource Factory locations
  preparePublish(): Promise<void>; // -- replace deps.* with remote RF locations, TODO: tag, and push to remote
  gitHookPrepareCommitMsg(): Promise<void>; // called by .git/hooks/prepare-commit-msg
  gitHookPreCommit(): Promise<void>; // called by .git/hooks/pre-commit
  gitHookPrePush(): Promise<void>; // called by .git/hooks/pre-push
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
    this.on("init", init(this, sandbox));
    this.on("help", t.eeHelpTask(this));
    this.on("doctor", doctor(sandbox));
    this.on("gitHookPrepareCommitMsg", gitHookPrepareCommitMsg(this, sandbox));
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
