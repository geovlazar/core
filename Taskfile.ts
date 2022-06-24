import {
  dzx,
  rflGitHubTask as gh,
  rflSQLa as SQLa,
  rflTask as t,
  rflTaskUDD as udd,
} from "./deps.ts";
import * as m from "./models.ts";

type GeneratableAsset = {
  readonly sqliteSqlSrc: string;
  readonly erdPlantUmlIE: string;
  readonly osQueryATCConfig: string;
  readonly sqliteDb: string;
};

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
  clean(): Promise<void>;
  // TODO: doctor(): Promise<void>; -- test that all dependencies are available
  // TODO: deploy(): Promise<void>; -- setup /etc/opsfolio.sqlite.db, /etc/opsfolio.osquery-atc.json links, cron tasks, etc. (upgrade as necessary)
  generateArtifacts(): Promise<void>; // -- generate *.auto.sql, *.osquery-atc.auto.json, etc.
  dbDeploy(): Promise<void>; // -- generateArtifacts() and then create ("migrate" or "deploy") the database
  // TODO: prepareSandbox(): Promise<void>; -- replace deps.* with local Resource Factory locations
  // TODO: publish(): Promise<void>; -- replace deps.* with remote RF locations, tag, and push to remote
}> {
  constructor() {
    super();

    // housekeeping tasks
    this.on("help", t.eeHelpTask(this));
    this.on("updateDenoDeps", udd.updateDenoDepsTask());
    this.on("ensureProjectDeps", ensureProjectDeps());
    this.on("maintain", async () => {
      await this.emit("ensureProjectDeps");
      await this.emit("updateDenoDeps");
    });

    const ga: GeneratableAsset = {
      sqliteSqlSrc: "opsfolio.auto.sql",
      erdPlantUmlIE: "opsfolio.auto.puml",
      osQueryATCConfig: "opsfolio.auto.osquery-atc.json",
      sqliteDb: "opsfolio.auto.sqlite.db",
    };

    // deno-lint-ignore require-await
    this.on("clean", async () => {
      Object.values(ga).forEach((f) => {
        try {
          Deno.removeSync(f);
        } catch { /** ignore files don't exist */ }
      });
    });

    this.on("generateArtifacts", async () => {
      const ctx = SQLa.typicalSqlEmitContext();
      const models = m.models();
      await Deno.writeTextFile(ga.sqliteSqlSrc, models.DDL.SQL(ctx));
      await Deno.writeTextFile(ga.erdPlantUmlIE, models.plantUmlIE(ctx));
      await Deno.writeTextFile(
        ga.osQueryATCConfig,
        JSON.stringify(
          models.osQueryATCConfig((tableName, atcPartial) => {
            return {
              osQueryTableName: `opsfolio_${tableName}`,
              atcRec: { ...atcPartial, path: ga.sqliteDb },
            };
          }),
          undefined,
          "  ",
        ),
      );
    });
    this.on("dbDeploy", async () => {
      await this.emit("generateArtifacts");
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
