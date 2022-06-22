# Opsfolio Infrastructure Assurance

Opsfolio is an _infrastructure assurance_ tool to help define expectations for
assets and boundaries and then use tools like osQuery to ensure expectations are
met.

- _Expectations_ need to be established independent of tools like osQuery since
  most tools help determine the _actuals_ rather than _expectations_.
- Certain _actuals_ need to be managed by Opsfolio because most tools don't
  manage non-technical _actuals_.

## Deployment

```bash
# install deno, git
export OPSFOLIO_HOME=/opt/opsfolio
git clone https://github.com/opsfolio/core $OPSFOLIO_HOME
cd $OPSFOLIO_HOME
deno run -A --unstable Taskfile.ts deploy
deno run -A --unstable Taskfile.ts doctor
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
