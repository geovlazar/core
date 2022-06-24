import {
  rflSQL as sql,
  rflSQLa as SQLa,
  rflSqlite as sqlite,
  rflTask as t,
  rflTaskUDD as udd,
} from "./deps.ts";
import * as m from "./models.ts";

type GeneratableAsset = {
  readonly sqliteSqlSrc: string;
  readonly osQueryATCConfig: string;
  readonly sqliteDb: string;
  readonly plantUmlIE?: string;
};

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
  clean(): Promise<void>;
  // TODO: doctor(): Promise<void>; -- test that all dependencies are available
  // TODO: deploy(): Promise<void>; -- setup /etc/opsfolio.sqlite.db, /etc/opsfolio.osquery-atc.json links, cron tasks, etc. (upgrade as necessary)
  generateArtifacts(): Promise<void>; // -- generate *.auto.sql, *.osquery-atc.auto.json, etc.
  dbDeploy(): Promise<void>; // -- generateArtifacts() and then create ("migrate" or "deploy") the database
  // TODO: prepareSandbox(): Promise<void>; -- replace deps.* with local Resource Factory locations
  // TODO: publish(): Promise<void>; -- replace deps.* with remote RF locations, tag, and push to remote
}> {
  constructor(readonly config: { readonly ga: GeneratableAsset }) {
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

    // deno-lint-ignore require-await
    this.on("clean", async () => {
      const { ga } = config;
      Object.values(ga).forEach((f) => {
        try {
          Deno.removeSync(f);
        } catch { /** ignore files don't exist */ }
      });
    });

    this.on("generateArtifacts", async () => {
      const { ga } = config;
      const ctx = SQLa.typicalSqlEmitContext();
      const models = m.models();
      await Deno.writeTextFile(ga.sqliteSqlSrc, models.DDL.SQL(ctx));
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
      if (ga.plantUmlIE) {
        await Deno.writeTextFile(ga.plantUmlIE, models.plantUmlIE(ctx));
      }
    });

    this.on("dbDeploy", async () => {
      await this.emit("clean");
      await this.emit("generateArtifacts");

      const { ga } = config;
      const db = new sqlite.SqliteDatabase({
        storageFileName: () => ga.sqliteDb,
        events: () => new sql.SqlEventEmitter(),
      });

      const ctx = SQLa.typicalSqlEmitContext();
      const models = m.models();
      db.dbStore.execute(models.DDL.SQL(ctx));
      db.close();
    });
  }
}
