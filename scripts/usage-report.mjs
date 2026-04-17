#!/usr/bin/env node
// Marp Slide Studio — usage report
// Reads ${CLAUDE_PLUGIN_DATA:-~/.marp-slide-studio}/usage.jsonl (emitted by
// hooks/log-skill-usage.sh on every Task tool invocation) and prints an
// aggregated summary.
//
// Usage:
//   node scripts/usage-report.mjs              # all time
//   node scripts/usage-report.mjs --days 7     # last 7 days only
//   node scripts/usage-report.mjs --raw        # print raw jsonl path + sample

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const DATA_DIR = process.env.CLAUDE_PLUGIN_DATA || join(homedir(), '.marp-slide-studio');
const LOG = join(DATA_DIR, 'usage.jsonl');

const args = process.argv.slice(2);
const daysArg = args.indexOf('--days');
const days = daysArg >= 0 ? parseInt(args[daysArg + 1], 10) : null;
const raw = args.includes('--raw');

if (!existsSync(LOG)) {
  console.log(`No usage log yet at ${LOG}`);
  console.log('(The log file is created on first Task-tool invocation after installing v0.8.0+.)');
  process.exit(0);
}

if (raw) {
  console.log(`Log file: ${LOG}`);
  const lines = readFileSync(LOG, 'utf8').trim().split('\n');
  console.log(`Total lines: ${lines.length}`);
  console.log(`First 3:`);
  for (const l of lines.slice(0, 3)) console.log('  ' + l);
  console.log(`Last 3:`);
  for (const l of lines.slice(-3)) console.log('  ' + l);
  process.exit(0);
}

const lines = readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean);
const cutoff = days ? Date.now() - days * 86400_000 : 0;

const parsed = [];
for (const line of lines) {
  try {
    const row = JSON.parse(line);
    if (cutoff && new Date(row.ts).getTime() < cutoff) continue;
    parsed.push(row);
  } catch { /* skip malformed */ }
}

if (parsed.length === 0) {
  console.log(`No entries in log${days ? ` in last ${days} days` : ''}.`);
  process.exit(0);
}

// Aggregate by tool
const byTool = new Map();
const byDay = new Map();
const sessions = new Set();

for (const row of parsed) {
  byTool.set(row.tool, (byTool.get(row.tool) || 0) + 1);
  const day = row.ts.substring(0, 10);
  byDay.set(day, (byDay.get(day) || 0) + 1);
  if (row.session && row.session !== 'unknown') sessions.add(row.session);
}

const range = `${parsed[0].ts.substring(0, 10)} → ${parsed[parsed.length - 1].ts.substring(0, 10)}`;
console.log(`\n◆ Marp Slide Studio — usage report`);
console.log(`  log: ${LOG}`);
console.log(`  range: ${range}${days ? ` (last ${days} days)` : ''}`);
console.log(`  invocations: ${parsed.length}`);
console.log(`  distinct sessions: ${sessions.size}`);

console.log(`\nBy tool:`);
const sortedTools = [...byTool.entries()].sort((a, b) => b[1] - a[1]);
for (const [tool, count] of sortedTools) {
  const bar = '█'.repeat(Math.min(40, count));
  console.log(`  ${tool.padEnd(20)} ${String(count).padStart(5)} ${bar}`);
}

console.log(`\nDaily (last 14 days):`);
const sortedDays = [...byDay.entries()].sort();
for (const [day, count] of sortedDays.slice(-14)) {
  const bar = '·'.repeat(Math.min(60, count));
  console.log(`  ${day}  ${String(count).padStart(4)} ${bar}`);
}

console.log('');
