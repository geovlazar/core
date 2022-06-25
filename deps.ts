export * as path from "https://deno.land/std@0.144.0/path/mod.ts";

// use Taskfile.ts prepare-sandbox and publish tasks to mutate RF module URLs:
//   path-task prepare-sandbox will switch RF URLs to local mGit location
//   path-task publish will switch RF URLs to remote GitHub location

export * as rflAxiom from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/safety/axiom.ts";
export * as rflSQL from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sql/mod.ts";
export * as rflSQLa from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sql/render/mod.ts";
export * as rflSQLaTypical from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sql/render/typical.ts";
export * as rflSqlShellTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sql/shell/task.ts";
export * as rflSqlDiagram from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sql/shell/osquery.ts";
export * as rflSqlite from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/sqlite/mod.ts";
export * as rflTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/task/core.ts";
export * as rflTaskUDD from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/task/udd.ts";
export * as rflGitHubTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.10/lib/task/github.ts";
