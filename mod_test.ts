import { dzx, rflWS as ws, testingAsserts as ta } from "./deps-test.ts";
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
    sqliteSql: models.seedDDL.SQL(ctx),
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

    // in the SQLite database the table is called `execution_context`
    const ee = await db.recordsDQL(
      "select code, value from execution_context",
    );
    ta.assert(ee);
    ta.assert(ee.records.length > 0);

    // TODO: loop through each TableDefinition and check if it was added to
    // SQLite schema; this allows testing whether a table was defined but
    // mistakenly left out of generated DDL (seed DDL)

    // TODO: loop through each EnumTable and check if it was added to
    // SQLite schema; this allows testing whether an enum table was defined
    // but mistakenly left out of generated DDL (seed DDL). For enums also
    // check whether the total number of rows is the same as the enums
    // defined.

    db.close();
  });

  await tc.step(`osqueryi ATC`, async () => {
    try {
      // in the SQLite database the table is called `execution_context` but when
      // accessed through osQuery, it's called opsfolio_execution_context since
      // all tables in the ATC database prefixed with `opsfolio_`.
      const osqResult = await dzx.$
        `osqueryi --config_path ${generatable.osQueryATCConfig} "select code, value from opsfolio_execution_context"`;
      ta.assertEquals(
        osqResult.stdout,
        ws.unindentWhitespace(`
      +------+-------------+
      | code | value       |
      +------+-------------+
      | 0    | DEVELOPMENT |
      | 1    | TEST        |
      | 2    | PRODUCTION  |
      +------+-------------+
      `),
      );
    } catch {
      console.log(
        `unable to run osqueryi ATC test case: osqueryi executable not found in path`,
      );
    }
  });

  await mod.clean(generatable);
});
