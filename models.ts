import {
  path,
  rflSQLa as SQLa,
  rflSqlDiagram as sqlD,
  rflSqlOsQuery as osQ,
  rflSqlTypical as SQLaTyp,
} from "./deps.ts";

// TODO:
// - [ ] increase number of enums for proper typing of lookups
// - [ ] strongly type all text to ints/date/etc. where necessary
// - [ ] convert relevant legacy Opsfolio Drupal CTVs to SQLa entities
// - [ ] convert relevant legacy IGS Operations Portfolio Specification (OPS) repo models to SQLa entities

// TODO: introduce Party, Person, etc. "typical" tables so in case "graph",
// "boundary", etc. are not as useful. Better to leave data models general
// instead of using Party or other universal models?

/**
 * All our table names should be strongly typed and consistent. Generics are
 * used so that they are passed into Axiom, SQLa domain, etc. properly typed.
 * @param name the name of the table
 * @returns the transformed table name (e.g. in case prefixes should be added)
 */
export function tableName<Name extends string, Qualified extends string = Name>(
  name: Name,
): Qualified {
  // for now we're not doing anything special but that could change in future
  return name as unknown as Qualified;
}

export enum ExecutionContext {
  DEVELOPMENT,
  TEST,
  PRODUCTION,
}

export enum AssetRiskType {
  TYPE1 = "asset risk type 1",
  TYPE2 = "asset risk type 2",
}

export enum GraphNature {
  SERVICE = "Service",
  APP = "Application",
}

export enum BoundaryNature {
  REGULATORY_TAX_ID = "Regulatory Tax ID", // like an "official" company (something with a Tax ID)
}

export function enumerations<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const mg = SQLaTyp.typicalModelsGovn(ddlOptions);
  const enumTableDefnOptions = { isIdempotent: true };
  const execCtx = SQLa.enumTable(
    tableName("execution_context"),
    ExecutionContext,
    enumTableDefnOptions,
  );
  const graphNature = SQLa.enumTextTable(
    tableName("graph_nature"),
    GraphNature,
    enumTableDefnOptions,
  );
  const boundaryNature = SQLa.enumTextTable(
    tableName("boundary_nature"),
    BoundaryNature,
    enumTableDefnOptions,
  );
  const assetRiskType = SQLa.enumTextTable(
    tableName("asset_risk_type"),
    AssetRiskType,
    enumTableDefnOptions,
  );

  // deno-fmt-ignore
  const seedDDL = SQLa.SQL<Context>(ddlOptions)`
      ${execCtx}

      ${graphNature}

      ${boundaryNature}

      ${assetRiskType}

      ${execCtx.seedDML}

      ${graphNature.seedDML}

      ${boundaryNature.seedDML}

      ${assetRiskType.seedDML}`;

  return {
    modelsGovn: mg,
    execCtx,
    graphNature,
    boundaryNature,
    assetRiskType,
    seedDDL,
    exposeATC: [execCtx, assetRiskType],
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
    graph_nature_id: enums.graphNature.foreignKeyRef.code(),
    name: SQLa.text(),
    description: SQLa.textNullable(),
    ...mg.housekeeping(),
  });

  const boundaryId = mg.primaryKey();
  const boundary = mg.table(tableName("boundary"), {
    boundary_id: boundaryId,
    parent_boundary_id: SQLa.selfRefForeignKeyNullable(boundaryId),
    graph_id: graph.foreignKeyRef.graph_id(),
    boundary_nature_id: enums.boundaryNature.foreignKeyRef.code(),
    name: SQLa.text(),
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

  const vulnerability = mg.table(tableName("vulnerability"), {
    vulnerability_id: mg.primaryKey(),
    short_name: SQLa.text(),
    source: SQLa.text(),
    affected_software: SQLa.text(),
    reference: SQLa.text(),
    status: SQLa.text(),
    patch_availability: SQLa.text(),
    severity: SQLa.text(),
    solutions: SQLa.text(),
    tags: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const threatSource = mg.table(tableName("threat_source"), {
    threat_source_id: mg.primaryKey(),
    threat_source: SQLa.text(),
    identifier: SQLa.text(),
    threat_source_type: SQLa.text(),
    source_of_information: SQLa.text(),
    capability: SQLa.text(),
    intent: SQLa.text(),
    targeting: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const threatEvent = mg.table(tableName("threat_event"), {
    threat_event_id: mg.primaryKey(),
    threat_event: SQLa.text(),
    identifier: SQLa.text(),
    threat_event_type: SQLa.integer(),
    event_classification: SQLa.text(),
    source_of_information: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  const billing = mg.table(tableName("billing"), {
    billing_id: mg.primaryKey(),
    purpose: SQLa.text(),
    bill_rate: SQLa.text(),
    period: SQLa.text(),
    effective_from_date: SQLa.dateTime(),
    effective_to_date: SQLa.text(),
    prorate: SQLa.integer(),
    ...mg.housekeeping(),
  });

  const scheduledTask = mg.table(tableName("scheduled_task"), {
    scheduled_task_id: mg.primaryKey(),
    description: SQLa.text(),
    task_date: SQLa.dateTime(),
    reminder_date: SQLa.dateTime(),
    assigned_to: SQLa.text(),
    reminder_to: SQLa.text(),
    ...mg.housekeeping(),
  });

  const timesheet = mg.table(tableName("timesheet"), {
    timesheet_id: mg.primaryKey(),
    time_hour: SQLa.integer(),
    timesheet_summary: SQLa.text(),
    start_time: SQLa.text(),
    end_time: SQLa.text(),
    ...mg.housekeeping(),
  });

  const certificate = mg.table(tableName("certificate"), {
    certificate_id: mg.primaryKey(),
    certificate_name: SQLa.text(),
    short_name: SQLa.text(),
    certificate_category: SQLa.text(),
    certificate_type: SQLa.text(),
    certificate_authority: SQLa.text(),
    validity: SQLa.text(),
    expiration_date: SQLa.dateTime(),
    domain_name: SQLa.text(),
    key_size: SQLa.integer(),
    path: SQLa.text(),
    ...mg.housekeeping(),
  });

  const device = mg.table(tableName("device"), {
    device_id: mg.primaryKey(),
    device_name: SQLa.text(),
    short_name: SQLa.text(),
    barcode: SQLa.text(),
    model: SQLa.text(),
    serial_number: SQLa.text(),
    firmware: SQLa.text(),
    data_center: SQLa.text(),
    location: SQLa.text(),
    purpose: SQLa.text(),
    description: SQLa.text(),
    ...mg.housekeeping(),
  });

  // deno-fmt-ignore
  const seedDDL = SQLa.SQL<Context>(ddlOptions)`
      ${host}

      ${graph}

      ${boundary}

      ${hostBoundary}

      ${raciMatrix}

      ${assetRisk}

      ${vulnerability}

      ${threatSource}

      ${threatEvent}

      ${billing}

      ${scheduledTask}

      ${timesheet}

      ${certificate}

      ${device}`;

  return {
    modelsGovn: mg,
    host,
    graph,
    boundary,
    hostBoundary,
    raciMatrix,
    assetRisk,
    vulnerability,
    threatSource,
    threatEvent,
    billing,
    scheduledTask,
    timesheet,
    certificate,
    device,
    seedDDL,
    exposeATC: [host, graph, boundary, hostBoundary, raciMatrix],
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
  const seedDDL = SQLa.SQL<Context>(ddlOptions)`
      -- Generated by ${path.basename(import.meta.url)}. DO NOT EDIT.

      PRAGMA foreign_keys = ON;

      ${SQLa.typicalSqlTextLintSummary}

      -- enumeration tables
      ${enums.seedDDL}

      -- content tables
      ${ents.seedDDL}

      ${SQLa.typicalSqlTmplEngineLintSummary}`;

  const atcCS = osQ.osQueryATCConfigSupplier(
    [...enums.exposeATC, ...ents.exposeATC].map((t) => ({
      tableName: t.tableName,
      columns: t.domains.map((d) => ({ columnName: d.identity })),
    })),
  );

  const osQueryATCConfig = (
    sqliteDbPath: string,
    _ctx: Context,
    osQueryTableName: (tableName: string) => string = (tableName) =>
      `opsfolio_${tableName}`,
  ) => {
    return atcCS((tableName, atcPartial) => {
      return {
        osQueryTableName: osQueryTableName(tableName),
        atcRec: { ...atcPartial, path: sqliteDbPath },
      };
    });
  };

  return {
    enumerations: enums,
    entities: ents,
    seedDDL,
    osQueryATCConfig,
    osQueryATCConfigJsonText: (
      sqliteDbPath: string,
      ctx: Context,
      osQueryTableName?: (tableName: string) => string,
    ) => {
      return JSON.stringify(
        osQueryATCConfig(sqliteDbPath, ctx, osQueryTableName),
      );
    },
    plantUmlIE: (ctx: Context, diagramName: string) =>
      sqlD.plantUmlIE(
        ctx,
        function* () {
          for (const e of Object.values(enums)) {
            if (SQLa.isEnumTableDefn(e)) {
              yield e;
            }
          }
          for (const e of Object.values(ents)) {
            if (SQLa.isTableDefinition(e)) {
              yield e;
            }
          }
        },
        sqlD.typicalPlantUmlIeOptions({
          diagramName,
          ...ents.modelsGovn.erdConfig,
        }),
      ),
  };
}

if (import.meta.main) {
  // if we're being called as a CLI, just emit the DDL SQL:
  //    deno run -A models.ts > opsfolio.auto.sql
  //    deno run -A models.ts | sqlite3 opsfolio.sqlite.db
  const m = models();
  console.log(m.seedDDL.SQL(SQLa.typicalSqlEmitContext()));
}
