export * as path from "https://deno.land/std@0.144.0/path/mod.ts";
export * as hex from "https://deno.land/std@0.144.0/encoding/hex.ts";
export * as dzx from "https://deno.land/x/dzx@0.3.1/mod.ts";

// use Taskfile.ts prepare-sandbox and publish tasks to mutate RF module URLs:
//   Taksfile.ts prepare-sandbox will switch RF URLs to local mGit location
//   Taksfile.ts prepare-publish will switch RF URLs to remote GitHub location (using latest tag)

export * as rflAxiom from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/safety/axiom.ts";
export * as rflSQL from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sql/mod.ts";
export * as rflSQLa from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sql/render/mod.ts";
export * as rflSqlTypical from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sql/models/typical.ts";
export * as rflSqlShellTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sql/shell/task.ts";
export * as rflSqlDiagram from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sql/shell/osquery.ts";
export * as rflSqlite from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/sqlite/mod.ts";
export * as rflTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/task/core.ts";
export * as rflTaskUDD from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/task/udd.ts";
export * as rflGitHubTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/task/github.ts";
export * as rflTextWS from "https://raw.githubusercontent.com/resFactory/factory/v0.9.14/lib/text/whitespace.ts";
