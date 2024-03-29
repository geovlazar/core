export * as path from "https://deno.land/std@0.149.0/path/mod.ts";
export * as hex from "https://deno.land/std@0.149.0/encoding/hex.ts";
export * as dzx from "https://deno.land/x/dzx@0.4.0/mod.ts";

// use Taskfile.ts prepare-sandbox and publish tasks to mutate RF module URLs:
//   Taksfile.ts prepare-sandbox will switch RF URLs to local mGit location
//   Taksfile.ts prepare-publish will switch RF URLs to remote GitHub location (using latest tag)

export * as rflDepsHelpers from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/deps-helpers.ts";
export * as rflAxiom from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/axiom/mod.ts";
export * as rflDiscoverFS from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/fs/discover.ts";
export * as rflSQL from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/sql/mod.ts";
export * as rflSQLa from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/sql/render/mod.ts";
export * as rflSqlDiagram from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/sql/engine/osquery.ts";
export * as rflSqlite from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/sql/engine/sqlite.ts";
export * as rflTask from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/core.ts";
export * as rflTaskSqlite from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/sqlite.ts";
export * as rflTaskUDD from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/udd.ts";
export * as rflDenoConfigHelpers from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/deno-config.ts";
export * as rflGitTask from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/git.ts";
export * as rflGitHubTask from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/github.ts";
export * as rflDoctorTask from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/doctor.ts";
export * as rflShellTask from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/task/shell.ts";
export * as rflTextWS from "https://raw.githubusercontent.com/resFactory/factory/v0.12.20/lib/text/whitespace.ts";
