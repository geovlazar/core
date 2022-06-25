import { testingAsserts as ta } from "./deps-test.ts";
import { rflSQL as sql, rflSQLa as SQLa, rflSqlite as sqlite } from "./deps.ts";
import * as mod from "./mod.ts";

Deno.test("Opsfolio generate artifacts", async (tc) => {
  const generatable = {
    sqliteSqlSrc: "opsfolio.auto.sql",
    plantUmlIE: "opsfolio.auto.puml",
    osQueryATCConfig: "opsfolio.auto.osquery-atc.json",
    sqliteDb: "opsfolio.auto.sqlite.db",
  };

  const ctx = SQLa.typicalSqlEmitContext();
  const models = mod.models();
  const assets = {
    sqliteSql: models.DDL.SQL(ctx),
    osQueryATCConfig: (sqliteDbPath: string) =>
      models.osQueryATCConfigJsonText(sqliteDbPath, ctx),
    plantUmlIE: models.plantUmlIE(ctx),
  };

  await mod.clean(generatable);
  await mod.generateArtifacts(assets, generatable);

  await tc.step(generatable.sqliteSqlSrc, async () => {
    ta.assert(await Deno.readTextFile(generatable.sqliteSqlSrc));
  });

  await tc.step(generatable.osQueryATCConfig, async () => {
    ta.assert(await Deno.readTextFile(generatable.osQueryATCConfig));
  });

  await tc.step(generatable.plantUmlIE, async () => {
    ta.assert(await Deno.readTextFile(generatable.plantUmlIE));
  });

  await tc.step(generatable.sqliteDb, async () => {
    await mod.dbDeploy(assets, generatable);
    const db = new sqlite.SqliteDatabase({
      storageFileName: () => generatable.sqliteDb,
      events: () => new sql.SqlEventEmitter(),
    });
    const ee = await db.recordsDQL(
      "select code, value from execution_context",
    );
    ta.assert(ee);
    ta.assert(ee.records.length > 0);
    db.close();
  });

  await mod.clean(generatable);
});
