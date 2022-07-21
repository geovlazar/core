import { testingAsserts as ta } from "./deps-test.ts";
import {
  dzx,
  rflSQLa as SQLa,
  rflSqlite as sqlite,
  rflTextWS as ws,
} from "./deps.ts";
import * as mod from "./mod.ts";

const cleanArtifactEV = Deno.env.get("OPSFOLIO_UT_CLEAN_ARTIFACTS");
const cleanArtifacts = typeof cleanArtifactEV === "undefined"
  ? true
  : (cleanArtifactEV == "false" || cleanArtifactEV == "0" ? false : true);

Deno.test("Opsfolio generate artifacts", async (tc) => {
  const generatable = {
    sqliteSqlSrc: "opsfolio.auto.sql",
    plantUmlIE: "opsfolio.auto.puml",
    osQueryATCConfig: "opsfolio.auto.osquery-atc.json",
    sqliteDb: "opsfolio.auto.sqlite.db",
  };

  const ddlOptions = SQLa.typicalSqlTextSupplierOptions();
  const ctx = SQLa.typicalSqlEmitContext();
  const sqlEngine = sqlite.sqliteEngine();
  const models = mod.models(ddlOptions);
  const assets = {
    sqliteSql: models.seedDDL.SQL(ctx),
    osQueryATCConfig: (sqliteDbPath: string) =>
      models.osQueryATCConfigJsonText(sqliteDbPath, ctx),
    plantUmlIE: models.plantUmlIE(ctx, "models"),
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
    const db = sqlEngine.instance({
      storageFileName: () => generatable.sqliteDb,
    });

    // in the SQLite database the table is called `execution_context` but we
    // use SQLa.SQL({ symbolsFirst: true }) to automatically find colum names
    // and table name based on type-safe generics
    const ec = models.enumerations.execCtx;
    const ecc = ec.columns;
    const ee = await db.recordsDQL(
      ctx,
      SQLa.SQL({
        symbolsFirst: true,
      })`SELECT ${ecc.code}, ${ecc.value} from ${ec}`,
    );
    ta.assert(ee);
    ta.assert(ee.records.length == 3);

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
      dzx.$.verbose = false;
      // in the SQLite database the table is called `execution_context` but when
      // accessed through osQuery, it's called opsfolio_execution_context since
      // all tables in the ATC database prefixed with `opsfolio_`.
      const osqResult = await dzx
        .$`osqueryi --config_path ${generatable.osQueryATCConfig} "select code, value from opsfolio_execution_context"`;
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

  await tc.step(`no lint issues`, () => {
    ta.assertEquals(
      ddlOptions.sqlTextLintState?.lintedSqlText.lintIssues.length,
      0,
      `Please see ${generatable.sqliteSqlSrc} for SQL lint issues`,
    );
    ta.assertEquals(
      ddlOptions.sqlTextLintState?.lintedSqlTmplEngine.lintIssues.length,
      0,
      `Please see ${generatable.sqliteSqlSrc} for template engine lint issues`,
    );
  });

  if (cleanArtifacts) await mod.clean(generatable);
});
