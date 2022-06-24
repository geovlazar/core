export * as colors from "https://deno.land/std@0.144.0/fmt/colors.ts";
export * as path from "https://deno.land/std@0.144.0/path/mod.ts";
export * as fs from "https://deno.land/std@0.144.0/fs/mod.ts";

export * as dzx from "https://deno.land/x/dzx@0.3.1/mod.ts";

// when local: ../../../github.com/resFactory/factory/*
// when remote (latest): https://raw.githubusercontent.com/resFactory/factory/main/*
// when remote (pinned): https://raw.githubusercontent.com/resFactory/factory/v0.9.8/*

export * as rflAxiom from "../../resFactory/factory/lib/safety/axiom.ts";
export * as rflSQL from "../../resFactory/factory/lib/sql/mod.ts";
export * as rflSQLa from "../../resFactory/factory/lib/sql/render/mod.ts";
export * as rflSQLaTypical from "../../resFactory/factory/lib/sql/render/typical.ts";
export * as rflSqlShellTask from "../../resFactory/factory/lib/sql/shell/task.ts";
export * as rflSqlDiagram from "../../resFactory/factory/lib/sql/diagram/mod.ts";
export * as rflSqlOsQuery from "../../resFactory/factory/lib/sql/shell/osquery.ts";
export * as rflSqlite from "../../resFactory/factory/lib/sqlite/mod.ts";
export * as rflTask from "../../resFactory/factory/lib/task/core.ts";
export * as rflTaskUDD from "../../resFactory/factory/lib/task/udd.ts";
export * as rflGitHubTask from "../../resFactory/factory/lib/task/github.ts";
