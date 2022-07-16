import {
  rflAxiom as ax,
  rflSQLa as SQLa,
  rflSqlDiagram as erd,
} from "./deps.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

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

export const enumTableDefnOptions = { isIdempotent: true };

export enum RecordStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  ARCHIVED = "Archived",
  DELETED = "Deleted",
}

export const recordStatus = SQLa.enumTextTable(
  tableName("record_status"),
  RecordStatus,
  enumTableDefnOptions,
);

export type HousekeepingColumnsDefns<Context extends SQLa.SqlEmitContext> = {
  readonly created_at: SQLa.AxiomSqlDomain<Date | undefined, Context>;
  readonly record_status_id: SQLa.AxiomSqlDomain<string, Context>;
};

/**
 * typicalModelsGovn is a "models governer" helpers object that supplies
 * functions for "typical" schemas that prepare tables in a "governed" fashion
 * with a primary key named `<tableName>_id` and with standard "housekeeping"
 * columns such as `created_at` and `record_status_id`.
 * @param ddlOptions optional DDL string template literal options
 * @returns a single object with helper functions as properties (for building models)
 */
export function typicalModelsGovn<Context extends SQLa.SqlEmitContext>(
  ddlOptions?: SQLa.SqlTextSupplierOptions<Context> & {
    readonly sqlNS?: SQLa.SqlNamespaceSupplier;
  },
) {
  // TODO: convert this to a UUID to allow database row merging/syncing
  const primaryKey = () =>
    SQLa.autoIncPrimaryKey<number, Context>(SQLa.integer());

  function housekeeping<
    Context extends SQLa.SqlEmitContext,
  >(): HousekeepingColumnsDefns<Context> {
    return {
      created_at: SQLa.createdAt(),
      record_status_id: recordStatus.foreignKeyRef.code(),
    };
  }

  // "created_at" is considered "housekeeping" with a default so don't
  // emit it as part of the insert DML statement
  const defaultIspOptions: SQLa.InsertStmtPreparerOptions<
    Any,
    Any,
    Any,
    Context
  > = { isColumnEmittable: (name) => name == "created_at" ? false : true };

  /**
   * All of our "content" or "transaction" tables will follow a specific format,
   * namely that they will have a single primary key with the same name as the
   * table with _id appended and common "houskeeping" columns like created_at.
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
    return {
      ...SQLa.tableDefinition(tableName, props, {
        isIdempotent: true,
        sqlNS: ddlOptions?.sqlNS,
      }),
      ...SQLa.tableDomainsRowFactory(tableName, props, { defaultIspOptions }),
      ...SQLa.tableSelectFactory(tableName, props),
      view: SQLa.tableDomainsViewWrapper(
        `${tableName}_vw`,
        tableName,
        props,
      ),
      defaultIspOptions, // in case others need to wrap the call
    };
  };

  const erdConfig = erd.typicalPlantUmlIeOptions();

  return {
    // create aliases for the domains that we want to allow so that we can
    // add extensions in a governed fashion
    domains: {
      text: SQLa.text,
      textNullable: SQLa.textNullable,
      integer: SQLa.integer,
      date: SQLa.date,
      dateTime: SQLa.dateTime,
    },
    primaryKey,
    housekeeping,
    table,
    enumTable: SQLa.enumTable,
    enumTextTable: SQLa.enumTextTable,
    prepareSeedDDL: SQLa.SQL<Context>(ddlOptions),
    defaultIspOptions,
    erdConfig,
  };
}
