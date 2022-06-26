# Opsfolio Infrastructure Assurance

Opsfolio is an _infrastructure assurance_ tool to help define expectations for
assets and boundaries and then use tools like osQuery to ensure expectations are
met.

- _Expectations_ need to be established independent of tools like osQuery since
  most tools help determine the _actuals_ rather than _expectations_.
- Certain _actuals_ need to be managed by Opsfolio because most tools don't
  manage non-technical _actuals_ (such as a risk register or RACI chart).

## Conventions

Opsfolio generates files using the convention `*.auto.*` which means that it's
an _auto_-generated file and should not be modified. Any file that has
`*.auto.*` in the file means that it will be deleted and recreated whenever
necessary.

## Installation

```bash
# install deno, git and add them to $PATH
export OPSFOLIO_HOME=/opt/opsfolio
git clone https://github.com/opsfolio/core $OPSFOLIO_HOME
cd $OPSFOLIO_HOME
deno run -A --unstable Taskfile.ts deploy
deno run -A --unstable Taskfile.ts doctor
```

## osQuery ATC Database Deployment

Opsfolio uses osQuery's
[Automatic Table Construction (ATC)](https://osquery.readthedocs.io/en/stable/deployment/configuration/#automatic-table-construction)
feature to register new `opsfolio_*` tables. Once `deno Taskfile.ts db-deploy`
is used, a SQLite database is created along with
`opsfolio.auto.osquery-atc.json` which registers the Opsfolio tables so that
they can be used via `osqueryi` or other osQuery interfaces.

```bash
cd $OPSFOLIO_HOME
deno run -A --unstable Taskfile.ts db-deploy
osqueryi --config_path ./opsfolio.auto.osquery-atc.json "select code, value from opsfolio_execution_context"
```

Once you run `osqueryi` you should see the following output if the osQuery ATC
configuration and database were properly deployed:

```
+------+-------------+
| code | value       |
+------+-------------+
| 0    | DEVELOPMENT |
| 1    | TEST        |
| 2    | PRODUCTION  |
+------+-------------+
```

If you get `Error: no such table: opsfolio_execution_context` when you run
`osqueryi` try running with `--verbose` flag:

```bash
osqueryi --verbose --config_path ./opsfolio.auto.osquery-atc.json "select code, value from opsfolio_execution_context"
```

Look for lines like this:

```
...auto_constructed_tables... Removing stale ATC entries
                          ... ATC table: opsfolio_execution_context Registered
                          ... ATC table: opsfolio_asset_risk_type Registered
```

## Implementation Strategies

- Opsfolio uses [Resource Factory](https://github.com/resFactory/factory)
  [SQLa](https://github.com/resFactory/factory/tree/main/lib/sql/render) to
  create osQuery
  [Automatic Table Construction](https://osquery.readthedocs.io/en/stable/deployment/configuration/)
  configurations. See
  [this article](https://blog.kolide.com/build-custom-osquery-tables-using-atc-ab112a30674c)
  and
  [this gist](https://gist.github.com/FritzX6/0aa5b25e9caa232103091de31b9f5295)
  for elaboration.
- osQuery fleet management via PostgreSQL FDW façade. The Opsfolio FDW uses
  osQuery remote APIs to perform distributed queries, provide `osqueryd`
  configurations to the fleet, and provide PostgreSQL simulated tables for
  scheduled queries (packs). What we’re trying to do is to use existing open
  source tools that can be wrapped in FDWs to manage a fleet of osQuery servers.
  Basically, creating something SPG or Kolide Fleet except built entirely on top
  of PostgreSQL, FDWs, and tools like Grafana or Metabase that can sit on top of
  PG. The custom FDW would use existing osqueryd remote API to send and receive
  query data and allow anything that can read from PG to be able to collect
  osQuery data.

![architecture](support/docs/architecture.drawio.svg)

## Information Models

- **Graph**. This is the top-level "assets graph" which is considered the _root
  node_
  - **Boundary**. Each Graph contains one or more asset boundaries (e.g. a VLAN,
    a Container, etc.). Boundaries can contain one or more boundaries within it
    and also at multiple nested levels.
    - **Sub Boundary**. (Optional) Boundaries can contains one or more children
      (Sub Boundary) hierarchically.
    - **Category**. A similar group of assets can be classified into a Category
      and assigned to one or more boundaries. That is, categories can be defined
      independent of boundaries (e.g. a "Category Catalog") and then assigned to
      one more boundaries. Boundaries can contain one or more categories of
      assets.
      - **Sub Category** (optional). Categories can have sub-categories of
        assets hierarchically.
        - **Asset**. This is the main node and is where most of the activities
          occur.
- **Label**. A label can be applied across graph structures to allow
  non-hiearachical grouping. While categories imply ownership (e.g. "belongs to"
  relationships), labels imply more generalized associations.
- **Context**. A _context_ is similar to a label but it is specialized to allow
  depiction of environments such as dev/test/stage/prod/etc.

## Visualizing Entity-Relationship Diagrams (ERDs) using PlantUML in VS Code

To preview `*.puml` PlantUML-based Information Engineering (IE) ERDs in VS Code,
you'll need to:

- Install the
  [PlantUML VS Code (jebbs.plantuml)](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
  extension
- Install Graphviz `dot` executable
- Install Java JRE

To setup Graphviz:

```
sudo apt-get update && sudo apt-get install graphviz
```

To install Java:

```
asdf install java oracle-17
asdf global java oracle-17
whereis java
```

Use location of `whereis java` to set in VS Code PlantUML
`Java executable location` configuration.
