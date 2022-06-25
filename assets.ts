import { rflSQL as sql, rflSqlite as sqlite } from "./deps.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

type AssetsConfig = {
  readonly sqliteSqlSrc: string;
  readonly osQueryATCConfig: string;
  readonly sqliteDb: string;
  readonly plantUmlIE: string;
};

// deno-lint-ignore require-await
export async function clean(ga: AssetsConfig) {
  Object.values(ga).forEach((f) => {
    try {
      Deno.removeSync(f);
    } catch { /** ignore files don't exist */ }
  });
}

export async function generateArtifacts(assets: {
  readonly sqliteSql: string;
  readonly osQueryATCConfig: (sqliteDbPath: string) => string;
  readonly plantUmlIE?: string;
}, ga: AssetsConfig) {
  await Deno.writeTextFile(ga.sqliteSqlSrc, assets.sqliteSql);
  await Deno.writeTextFile(
    ga.osQueryATCConfig,
    assets.osQueryATCConfig(ga.sqliteDb),
  );
  if (assets.plantUmlIE) {
    await Deno.writeTextFile(ga.plantUmlIE, assets.plantUmlIE);
  }
}

// deno-lint-ignore require-await
export async function dbDeploy(assets: {
  readonly sqliteSql: string;
}, ga: AssetsConfig) {
  const db = new sqlite.SqliteDatabase({
    storageFileName: () => ga.sqliteDb,
    events: () => new sql.SqlEventEmitter(),
  });
  db.dbStore.execute(assets.sqliteSql);
  db.close();
}
