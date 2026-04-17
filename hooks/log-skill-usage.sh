#!/usr/bin/env bash
# Marp Slide Studio — PreToolUse hook that appends one JSONL line per Task invocation
# to ${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/usage.jsonl.
#
# Silent on success. Silent on failure too — a logging hook should never block the session.

set -u

DATA_DIR="${CLAUDE_PLUGIN_DATA:-$HOME/.marp-slide-studio}"
LOG_FILE="${DATA_DIR}/usage.jsonl"

mkdir -p "$DATA_DIR" 2>/dev/null || exit 0

# Best-effort timestamp + which tool was invoked. The hook is invoked per PreToolUse,
# so we just record the moment and a minimal payload. Claude Code sets a few env vars
# for hook scripts — we capture the ones that commonly exist without hard-failing.
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TOOL="${CLAUDE_HOOK_TOOL:-Task}"
SESSION="${CLAUDE_SESSION_ID:-unknown}"
CWD=$(pwd 2>/dev/null || echo unknown)

# JSONL emit (one line, valid JSON). Use printf + escape double-quotes in CWD.
CWD_ESC=$(printf '%s' "$CWD" | sed 's/"/\\"/g')
printf '{"ts":"%s","tool":"%s","session":"%s","cwd":"%s"}\n' \
  "$TS" "$TOOL" "$SESSION" "$CWD_ESC" >> "$LOG_FILE" 2>/dev/null || true

exit 0
