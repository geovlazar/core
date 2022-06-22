import { path, rflAxiom as ax, rflSQLa as SQLa } from "./deps.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

export function modelsAide<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  // TODO: convert this to a UUID to allow database row merging/syncing
  const primaryKey = () =>
    SQLa.autoIncPrimaryKey<number, Context>(SQLa.integer());

  type HousekeepingColumnsDefns<
    Context extends SQLa.SqlEmitContext,
  > = {
    readonly created_at: SQLa.AxiomSqlDomain<Date | undefined, Context>;
  };

  function housekeeping<
    Context extends SQLa.SqlEmitContext,
  >(): HousekeepingColumnsDefns<Context> {
    return {
      created_at: SQLa.dateTimeNullable(undefined, {
        sqlDefaultValue: () => ({ SQL: () => `CURRENT_TIMESTAMP` }),
      }),
    };
  }

  /**
   * All of our tables will follow a specific format, namely that they will have
   * a single primary key with the same name as the table with _id appended and
   * common "houskeeping" columns like created_at.
   * TODO: figure out how to automatically add ...housekeeping() to the end of
   * each table (it's easy to add at the start of each table, but we want them
   * at the end after all the "content" columns).
   * @param tableName
   * @param props
   * @returns
   */
  const table = <
    TableName extends string,
    TPropAxioms extends
      & Record<string, ax.Axiom<Any>>
      & Record<`${TableName}_id`, ax.Axiom<Any>>
      & HousekeepingColumnsDefns<Context>,
  >(
    tableName: TableName,
    props: TPropAxioms,
  ) => {
    // "created_at" is considered "housekeeping" with a default so don't
    // emit it as part of the insert DML statement
    const defaultIspOptions: SQLa.InsertStmtPreparerOptions<
      TableName,
      Any,
      Any,
      Context
    > = { isColumnEmittable: (name) => name == "created_at" ? false : true };
    return {
      ...SQLa.tableDefinition(tableName, props, {
        isIdempotent: true,
        sqlNS: ddlOptions?.sqlNS,
      }),
      ...SQLa.tableDomainsRowFactory(tableName, props, { defaultIspOptions }),
      view: SQLa.tableDomainsViewWrapper(
        `${tableName}_vw`,
        tableName,
        props,
      ),
      defaultIspOptions, // in case others need to wrap the call
    };
  };

  const enumTable = <
    TableName extends string,
    TPropAxioms extends
      & Record<`${TableName}_id`, ax.Axiom<Any>>
      & {
        readonly code: SQLa.AxiomSqlDomain<string, Context>;
        readonly value: SQLa.AxiomSqlDomain<string, Context>;
      }
      & HousekeepingColumnsDefns<Context>,
  >(
    tableName: TableName,
    seed?: { readonly code: string; readonly value: string }[],
    props: TPropAxioms = {
      [`${tableName}_id`]: primaryKey(),
      code: SQLa.text(),
      value: SQLa.text(),
      ...housekeeping(),
    } as TPropAxioms,
  ) => {
    const entity = table(tableName, props);
    return {
      ...entity,
      // see will be used in SQL interpolation template literal, which accepts
      // either a string, SqlTextSupplier, or array of SqlTextSuppliers; in our
      // case, if seed data is provided we'll prepare the insert DMLs as an
      // array of SqlTextSuppliers
      seed: seed
        ? seed.map((s) => entity.insertDML(s as Any))
        : `-- no ${tableName} seed rows`,
    };
  };

  return {
    primaryKey,
    housekeeping,
    table,
    enumTable,
  };
}

export function enumerations<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const ma = modelsAide(ddlOptions);
  const context = ma.enumTable("context", [
    { code: "dev", value: "development" },
    { code: "test", value: "test" },
    { code: "production", value: "production" },
  ]);

  // deno-fmt-ignore
  const DDL = SQLa.SQL<Context>(ddlOptions)`
      ${context}

      ${context.seed}`;

  return {
    context: ma.enumTable("context"),
    DDL,
  };
}

export function models<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const ma = modelsAide(ddlOptions);

  const boundary = ma.table("boundary", {
    boundary_id: ma.primaryKey(),
    name: SQLa.text(),
    ...ma.housekeeping(),
  });

  const host = ma.table("host", {
    host_id: ma.primaryKey(),
    host_name: SQLa.unique(SQLa.text()),
    ...ma.housekeeping(),
  });

  const hostBoundary = ma.table("host_boundary", {
    host_boundary_id: ma.primaryKey(),
    host_id: host.foreignKeyRef.host_id(),
    boundary_id: boundary.foreignKeyRef.boundary_id(),
    ...ma.housekeeping(),
  });

  // deno-fmt-ignore
  const DDL = SQLa.SQL<Context>(ddlOptions)`
      ${host}

      ${boundary}`;

  return {
    host,
    boundary,
    hostBoundary,
    DDL,
  };
}

export function dbDefn<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  const e = enumerations(ddlOptions);
  const m = models(ddlOptions);

  // deno-fmt-ignore
  const DDL = SQLa.SQL<Context>(ddlOptions)`
      -- Generated by ${path.basename(import.meta.url)}. DO NOT EDIT.

      ${SQLa.typicalSqlTextLintSummary}

      -- enumeration tables
      ${e.DDL}

      -- content tables
      ${m.DDL}

      ${SQLa.typicalSqlTmplEngineLintSummary}`;

  return {
    enumerations: e,
    models: m,
    DDL,
  };
}

if (import.meta.main) {
  // if we're being called as a CLI, just emit the DDL SQL:
  //    deno run -A models.ts > opsfolio.auto.sql
  //    deno run -A models.ts | sqlite3 synthetic.sqlite.db
  const ctx = SQLa.typicalSqlEmitContext();
  console.log(dbDefn().DDL.SQL(ctx));
}
