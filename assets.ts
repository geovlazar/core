import { dzx, hex, rflSqlite as sqlite } from "./deps.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

type AssetsConfig = {
  readonly sqliteSqlDestFile: string;
  readonly osQueryATCConfig: string;
  readonly sqliteDb: string;
  readonly plantUmlIE: string;
  readonly plantUmlIeSVG?: string;
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
  await Deno.writeTextFile(ga.sqliteSqlDestFile, assets.sqliteSql);
  await Deno.writeTextFile(
    ga.osQueryATCConfig,
    assets.osQueryATCConfig(ga.sqliteDb),
  );
  if (assets.plantUmlIE) {
    await Deno.writeTextFile(ga.plantUmlIE, assets.plantUmlIE);
    if (ga.plantUmlIeSVG) {
      await persistPlantUmlSVG({
        svgDestFile: ga.plantUmlIeSVG,
        pumlSrcText: assets.plantUmlIE,
      });
    }
  }
}

/**
 * Assuming SQL text has been generated, load it into an SQLite database on disk
 * using the embedded (usually WASM) SQLite engine.
 * @param ga
 */
// deno-lint-ignore require-await
export async function dbDeployEmbedded(assets: {
  readonly sqliteSql: string;
}, ga: AssetsConfig) {
  const sqlEngine = sqlite.sqliteEngine();
  const db = sqlEngine.instance({
    storageFileName: () => ga.sqliteDb,
  });
  db.dbStore.execute(assets.sqliteSql);
  db.close();
}

/**
 * Assuming a SQLite file has been generated, use `dzx` to prepare an SQLite
 * database in memory and then ".dump" what was created in memory into a file.
 * @param ga
 */
export async function dbDeployShell(
  ga: AssetsConfig & { removeExistingDb?: boolean; memoryFirst?: boolean },
) {
  // recursive is set to true to prevent exception if not found
  const { removeExistingDb = true, memoryFirst = true } = ga;
  if (removeExistingDb) {
    try {
      await Deno.remove(ga.sqliteDb);
    } catch { /* ignore if does not exist */ }
  }
  dzx.$.verbose = false;
  if (memoryFirst) {
    await dzx
      .$`echo "\n.dump\n" | cat ${ga.sqliteSqlDestFile} - | sqlite3 ":memory:" | sqlite3 ${ga.sqliteDb}`;
  } else {
    await dzx.$`cat ${ga.sqliteSqlDestFile} | sqlite3 ${ga.sqliteDb}`;
  }
}

/**
 * Accepts PlantUML source text and sends it to PlantUML.com for generating
 * an SVG using the public API server. See https://plantuml.com/text-encoding
 * @param options rendering arguments
 */
export async function persistPlantUmlSVG(
  { pumlSrcText, svgDestFile }: {
    readonly pumlSrcText: string;
    readonly svgDestFile: string;
  },
) {
  const te = (s: string) => new TextEncoder().encode(s);
  const td = (d: Uint8Array) => new TextDecoder().decode(d);
  const pumlHex = td(hex.encode(te(pumlSrcText)));
  const pumlURI = `https://www.plantuml.com/plantuml/svg/~h${pumlHex}`;
  const pumlResp = await fetch(pumlURI);
  if (pumlResp.ok) {
    await Deno.writeTextFile(svgDestFile, await pumlResp.text());
  } else {
    console.log(
      `Unable to fetch from https://www.plantuml.com/plantuml/svg/~h...:`,
      pumlResp.status,
      pumlResp.statusText,
    );
    console.log(pumlURI);
  }
}
