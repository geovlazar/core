export * as path from "https://deno.land/std@0.147.0/path/mod.ts";
export * as hex from "https://deno.land/std@0.147.0/encoding/hex.ts";
export * as dzx from "https://deno.land/x/dzx@0.3.1/mod.ts";

// use Taskfile.ts prepare-sandbox and publish tasks to mutate RF module URLs:
//   Taksfile.ts prepare-sandbox will switch RF URLs to local mGit location
//   Taksfile.ts prepare-publish will switch RF URLs to remote GitHub location (using latest tag)

export * as rflDepsHelpers from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/deps-helpers.ts";
export * as rflAxiom from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/safety/axiom.ts";
export * as rflDiscoverFS from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/fs/discover.ts";
export * as rflSQL from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/mod.ts";
export * as rflSQLa from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/render/mod.ts";
export * as rflSqlTypical from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/models/typical.ts";
export * as rflSqlShellTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/shell/task.ts";
export * as rflSqlDiagram from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/shell/osquery.ts";
export * as rflSqlite from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/sql/engine/sqlite.ts";
export * as rflTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/core.ts";
export * as rflTaskUDD from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/udd.ts";
export * as rflDenoConfigHelpers from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/deno-config.ts";
export * as rflGitTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/git.ts";
export * as rflGitHubTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/github.ts";
export * as rflDoctorTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/doctor.ts";
export * as rflShellTask from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/task/shell.ts";
export * as rflTextWS from "https://raw.githubusercontent.com/resFactory/factory/v0.9.47/lib/text/whitespace.ts";
