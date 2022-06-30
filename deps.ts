export * as path from "https://deno.land/std@0.145.0/path/mod.ts";
export * as hex from "https://deno.land/std@0.145.0/encoding/hex.ts";
export * as dzx from "https://deno.land/x/dzx@0.3.1/mod.ts";

// use Taskfile.ts prepare-sandbox and publish tasks to mutate RF module URLs:
//   Taksfile.ts prepare-sandbox will switch RF URLs to local mGit location
//   Taksfile.ts prepare-publish will switch RF URLs to remote GitHub location (using latest tag)

export * as rflDepsHelpers from "../../resFactory/factory/lib/deps-helpers.ts";
export * as rflAxiom from "../../resFactory/factory/lib/safety/axiom.ts";
export * as rflDiscoverFS from "../../resFactory/factory/lib/fs/discover.ts";
export * as rflSQL from "../../resFactory/factory/lib/sql/mod.ts";
export * as rflSQLa from "../../resFactory/factory/lib/sql/render/mod.ts";
export * as rflSqlTypical from "../../resFactory/factory/lib/sql/models/typical.ts";
export * as rflSqlShellTask from "../../resFactory/factory/lib/sql/shell/task.ts";
export * as rflSqlDiagram from "../../resFactory/factory/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "../../resFactory/factory/lib/sql/shell/osquery.ts";
export * as rflSqlite from "../../resFactory/factory/lib/sqlite/mod.ts";
export * as rflTask from "../../resFactory/factory/lib/task/core.ts";
export * as rflTaskUDD from "../../resFactory/factory/lib/task/udd.ts";
export * as rflGitTask from "../../resFactory/factory/lib/task/git.ts";
export * as rflGitHubTask from "../../resFactory/factory/lib/task/github.ts";
export * as rflDoctorTask from "../../resFactory/factory/lib/task/doctor.ts";
export * as rflTextWS from "../../resFactory/factory/lib/text/whitespace.ts";
