# Hooks

Lifecycle hooks registered by the plugin. Currently one.

## PreToolUse (matcher: `Task`)

Every time Claude invokes the `Task` tool (dispatching a subagent), [`log-skill-usage.sh`](log-skill-usage.sh) appends one JSONL line to:

```
${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/usage.jsonl
```

Each line:
```json
{"ts":"2026-04-17T02:29:29Z","tool":"Task","session":"<id>","cwd":"<pwd>"}
```

## Aggregating the log

```bash
node scripts/usage-report.mjs              # all-time summary
node scripts/usage-report.mjs --days 7     # last 7 days
node scripts/usage-report.mjs --raw        # sample + log path
```

## Why

Per Thariq ("How We Use Skills"):
> Use a `PreToolUse` hook to log skill usage. This allows you to find popular skills and identify skills that are undertriggering compared to expectations.

## Safety

The script is silent on success AND on failure — a logging hook must never block the session. `timeout: 3` ensures it cannot hang a tool call.

## Why `hooks.json` has only lifecycle keys

Claude Desktop's plugin validator treats EVERY top-level key in `hooks.json` as a lifecycle event name. Non-event keys like `$schema_version` or `$readme` trigger validation errors. This file exists precisely to hold the metadata that `hooks.json` can't.
