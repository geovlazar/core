import {
  dzx,
  rflGitHubTask as gh,
  rflSQLa as SQLa,
  rflTask as t,
  rflTaskUDD as udd,
} from "./deps.ts";
import * as m from "./models.ts";

// see setup and usage instructions in $RF_HOME/lib/task/README.md

// governance:
// * use natural Deno modules for tasks, only use Taskfile.ts as wrapper
// * be cross-platform and don't introduce dependencies unless necessary
// * use dzx whenever possible for exiting to shell, support Windows too

export class Tasks extends t.EventEmitter<{
  help(): void;
  ensureProjectDeps(): Promise<void>; // -- see $RF_HOME/lib/sql/shell/task.ts
  updateDenoDeps(): Promise<void>;
  maintain(): Promise<void>;
  // TODO: clean(): Promise<void>;
  // TODO: doctor(): Promise<void>; -- test that all dependencies are available
  // TODO: deploy(): Promise<void>; -- setup /etc/opsfolio.sqlite.db, /etc/opsfolio.osquery-atc.json links, cron tasks, etc. (upgrade as necessary)
  generateArtifacts(): Promise<void>; // -- generate *.auto.sql, *.osquery-atc.auto.json, etc.
  // TODO: prepareSandbox(): Promise<void>; -- replace deps.* with local Resource Factory locations
  // TODO: publish(): Promise<void>; -- replace deps.* with remote RF locations, tag, and push to remote
}> {
  constructor() {
    super();
    this.on("help", t.eeHelpTask(this));
    this.on("updateDenoDeps", udd.updateDenoDepsTask());
    this.on("ensureProjectDeps", ensureProjectDeps());
    this.on("maintain", async () => {
      await this.emit("ensureProjectDeps");
      await this.emit("updateDenoDeps");
    });
    this.on("generateArtifacts", async () => {
      const models = m.models();
      await Deno.writeTextFile(
        "opsfolio.auto.sql",
        models.DDL.SQL(SQLa.typicalSqlEmitContext()),
      );
      await Deno.writeTextFile(
        "opsfolio.osquery-atc.auto.json",
        JSON.stringify(
          models.osQueryATC(
            "opsfolio.sqlite.db",
            (tableName) => `opsfolio_${tableName}`,
          ),
          undefined,
          "  ",
        ),
      );
    });
  }
}

// TODO: add Windows versions too
export function ensureProjectDeps(destPath = "/bin") {
  return async () => {
    const options = { verbose: true };
    await gh.ensureGitHubBinary({
      // https://github.com/mergestat/mergestat
      // https://docs.mergestat.com/examples/basic-git
      repo: "mergestat/mergestat",
      destPath,
      release: {
        baseName: () => "mergestat-linux-amd64.tar.gz",
        unarchive: gh.extractSingleFileFromTarGZ(
          "./mergestat",
          "mergestat",
          {
            stripComponents: 1,
          },
        ),
      },
    }, options)();
    await gh.ensureGitHubBinary({
      // https://github.com/kashav/fsql
      repo: "kashav/fsql",
      destPath,
      release: {
        baseName: (latest) =>
          `fsql-${latest.tag_name.substring(1)}-linux-amd64.tar.gz`,
        unarchive: gh.extractSingleFileFromTarGZ(
          "linux-amd64/fsql",
          "fsql",
          {
            stripComponents: 1,
          },
        ),
      },
    }, options)();
    await gh.ensureGitHubBinary({
      // https://github.com/jhspetersson/fselect
      repo: "jhspetersson/fselect",
      destPath,
      release: {
        baseName: () => `fselect-x86_64-linux-musl.gz`,
        unarchive: async (archiveFsPath, finalize, ghbs, options) => {
          const destFsPath = path.join(ghbs.destPath, "fselect");
          dzx.$.verbose = options?.verbose ?? false;
          await dzx.$`gunzip -c ${archiveFsPath} > ${destFsPath}`;
          await finalize(destFsPath, ghbs);
          return destFsPath;
        },
      },
    }, options)();
  };
}

// only execute tasks if Taskfile.ts is being called as a script; otherwise
// it might be imported for tasks or other reasons and we shouldn't "run".
if (import.meta.main) {
  await t.eventEmitterCLI(Deno.args, new Tasks());
}
