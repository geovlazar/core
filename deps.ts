export * as path from "https://deno.land/std@0.144.0/path/mod.ts";
export * as hex from "https://deno.land/std@0.144.0/encoding/hex.ts";

// use Taskfile.ts prepare-sandbox and publish tasks to mutate RF module URLs:
//   path-task prepare-sandbox will switch RF URLs to local mGit location
//   path-task publish will switch RF URLs to remote GitHub location

export * as rflAxiom from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/safety/axiom.ts";
export * as rflSQL from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sql/mod.ts";
export * as rflSQLa from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sql/render/mod.ts";
export * as rflSqlTypical from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sql/models/typical.ts";
export * as rflSqlShellTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sql/shell/task.ts";
export * as rflSqlDiagram from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sql/shell/osquery.ts";
export * as rflSqlite from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/sqlite/mod.ts";
export * as rflTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/task/core.ts";
export * as rflTaskUDD from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/task/udd.ts";
export * as rflGitHubTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.11/lib/task/github.ts";
