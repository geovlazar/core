import { path, rflSQLa as SQLa, rflSQLaTypical as SQLaTyp } from "./deps.ts";

/**
 * All our table names should be strongly typed and consistent. Generics are
 * used so that they are passed into Axiom, SQLa domain, etc. properly typed.
 * @param name the name of the table
 * @returns the transformed table name (e.g. in case prefixes should be added)
 */
export function tableName<Name extends string, Qualified extends string = Name>(
  name: Name,
): Qualified {
  return name as unknown as Qualified;
}

export enum ContextEnum {
  DEVELOPMENT,
  TEST,
  PRODUCTION,
}

export enum AssetRiskType {
  TYPE1 = "asset risk type 1",
  TYPE2 = "asset risk type 2",
}

export function enumerations<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const lg = SQLaTyp.typicalLookupsGovn(ddlOptions);
  const contextET = lg.enumTable(tableName("context"), ContextEnum);
  const assetRiskType = lg.enumTextTable(
    tableName("asset_risk_type"),
    AssetRiskType,
  );

  // deno-fmt-ignore
  const DDL = SQLa.SQL<Context>(ddlOptions)`
      ${contextET}

      ${assetRiskType}

      ${contextET.seedDML}

      ${assetRiskType.seedDML}`;

  return {
    contextET,
    assetRiskType,
    DDL,
    exposeATC: [contextET, assetRiskType],
  };
}

export function entities<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const mg = SQLaTyp.typicalModelsGovn(ddlOptions);
  const enums = enumerations(ddlOptions);

  const graph = mg.table(tableName("graph"), {
    graph_id: mg.primaryKey(),
    name: SQLa.text(),
    ...mg.housekeeping(),
  });

  const boundary = mg.table(tableName("boundary"), {
    boundary_id: mg.primaryKey(),
    name: SQLa.text(),
    graph_id: graph.foreignKeyRef.graph_id(),
    ...mg.housekeeping(),
  });

  const host = mg.table(tableName("host"), {
    host_id: mg.primaryKey(),
    host_name: SQLa.unique(SQLa.text()),
    ...mg.housekeeping(),
  });

  const hostBoundary = mg.table(tableName("host_boundary"), {
    host_boundary_id: mg.primaryKey(),
    host_id: host.foreignKeyRef.host_id(),
    boundary_id: boundary.foreignKeyRef.boundary_id(),
    ...mg.housekeeping(),
  });

  const raciMatrix = mg.table(tableName("raci_matrix"), {
    raci_matrix_id: mg.primaryKey(),
    asset: SQLa.text(),
    responsible: SQLa.text(),
    accountable: SQLa.text(),
    consulted: SQLa.text(),
    informed: SQLa.text(),
    ...mg.housekeeping(),
  });

  const assetRisk = mg.table(tableName("asset_risk"), {
    asset_risk_id: mg.primaryKey(),
    asset_risk_type_id: enums.assetRiskType.foreignKeyRef.code(),
    asset: SQLa.text(),
    threat_event: SQLa.text(),
    relevance: SQLa.text(),
    likelihood: SQLa.text(),
    impact: SQLa.text(),
    ...mg.housekeeping(),
  });

  // tableTypes.typical('opsfolio_asset_risk', [
  //     columnTypes.identity(),
  //     columnTypes.enum('opsfolio_asset_risk_type', name = 'asset_risk_type_id', required=true),
  //     columnTypes.text('threat_event'),
  //     columnTypes.text('relevance'),
  //     columnTypes.text('likelihood'),
  //     columnTypes.text('impact'),
  //     columnTypes.text('risk')
  // ]),

  // deno-fmt-ignore
  const DDL = SQLa.SQL<Context>(ddlOptions)`
      ${host}

      ${graph}

      ${boundary}

      ${hostBoundary}

      ${raciMatrix}

      ${assetRisk}`;

  return {
    host,
    graph,
    boundary,
    hostBoundary,
    raciMatrix,
    assetRisk,
    DDL,
    exposeATC: [host, graph, boundary, hostBoundary, raciMatrix],
  };
}

export function osQueryConfig<Context extends SQLa.SqlEmitContext>(
  ...tables:
    // deno-lint-ignore no-explicit-any
    (SQLa.TableDefinition<any, Context> & SQLa.SqlDomainsSupplier<Context>)[]
) {
  type osQueryATCRecord = {
    readonly query: string;
    readonly path: string;
    readonly columns: string[];
    readonly platform?: string;
  };

  const osQueryATCRecords = tables.reduce(
    (result, table) => {
      result[table.tableName] = {
        query: `select ${
          table.domains.map((d) => d.identity).join(", ")
        } from ${table.tableName}`,
        columns: table.domains.map((d) => d.identity),
      };
      return result;
    },
    {} as Record<string, Omit<osQueryATCRecord, "path">>,
  );

  return {
    osQueryATC: (path: string, tableName: (suggested: string) => string) => {
      const ATC: Record<string, osQueryATCRecord> = {};
      for (const atcRec of Object.entries(osQueryATCRecords)) {
        const [suggestedTableName, atcPartial] = atcRec;
        ATC[tableName(suggestedTableName)] = { ...atcPartial, path };
      }
      return {
        auto_table_construction: ATC,
      };
    },
  };
}

export function models<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const enums = enumerations(ddlOptions);
  const ents = entities(ddlOptions);

  // deno-fmt-ignore
  const DDL = SQLa.SQL<Context>(ddlOptions)`
      -- Generated by ${path.basename(import.meta.url)}. DO NOT EDIT.

      ${SQLa.typicalSqlTextLintSummary}

      -- enumeration tables
      ${enums.DDL}

      -- content tables
      ${ents.DDL}

      ${SQLa.typicalSqlTmplEngineLintSummary}`;

  return {
    enumerations: enums,
    entities: ents,
    DDL,
    ...osQueryConfig(...enums.exposeATC, ...ents.exposeATC),
  };
}

if (import.meta.main) {
  // if we're being called as a CLI, just emit the DDL SQL:
  //    deno run -A models.ts > opsfolio.auto.sql
  //    deno run -A models.ts | sqlite3 opsfolio.sqlite.db
  const m = models();
  console.log(m.DDL.SQL(SQLa.typicalSqlEmitContext()));
}
