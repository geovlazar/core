# Project Git hooks

In order to use these hooks, run the following in the repo root after the
initial clone:

```bash
deno run -A --unstable Taskfile.ts init
```

You can also use:

```bash
git config core.hooksPath .githooks
```
