import { rflTask as t, rflTaskUDD as udd } from "./deps.ts";

type SandboxAsset = {
  depsTs: string;
  resFactoryTag: string;
};

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
      `"https://raw.githubusercontent.com/resFactory/factory/${sb.resFactoryTag}/`,
    );
  if (mutatedDepsTs != origDepsTs) {
    await Deno.writeTextFile(sb.depsTs, mutatedDepsTs);
  }
}

// see setup and usage instructions in $RF_HOME/lib/task/README.md

// governance:
// * use natural Deno modules for tasks, only use Taskfile.ts as wrapper
// * be cross-platform and don't introduce dependencies unless necessary
// * use dzx whenever possible for exiting to shell, support Windows too

export class Tasks extends t.EventEmitter<{
  help(): void;
  ensureProjectDeps(): Promise<void>; // download binaries from sources
  updateDenoDeps(): Promise<void>;
  maintain(): Promise<void>;
  // TODO: doctor(): Promise<void>; -- test that all dependencies are available
  prepareSandbox(): Promise<void>; // -- replace deps.* with local Resource Factory locations
  publish(): Promise<void>; // -- replace deps.* with remote RF locations, TODO: tag, and push to remote
}> {
  constructor(
    readonly config: {
      readonly sandbox: SandboxAsset;
    },
  ) {
    super();

    // housekeeping tasks
    this.on("help", t.eeHelpTask(this));
    this.on("updateDenoDeps", udd.updateDenoDepsTask());
    //TODO: see lib/sql/shell/task.ts
    //      this.on("ensureProjectDeps", ensureProjectDeps());
    this.on("maintain", async () => {
      await this.emit("ensureProjectDeps");
      await this.emit("updateDenoDeps");
    });

    this.on(
      "prepareSandbox",
      async () => await mutateResFactoryDeps(config.sandbox, "sandbox"),
    );
    this.on(
      "publish",
      async () => await mutateResFactoryDeps(config.sandbox, "publish"),
    );
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
        resFactoryTag: "main",
      },
    }),
  );
}
