#!/usr/bin/env node
// Append a structured entry to a deck's .auto-log.md.
// Keeps formatting consistent across autopilot steps.
//
// Usage:
//   log.mjs <slug> init    <config-json-path>       # write header + decisions table
//   log.mjs <slug> step    "<step name>" ok|fail|warn "<detail>" [durationMs]
//   log.mjs <slug> final   ok|partial|failed        # final summary (reads previous steps)

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [, , slug, cmd, ...rest] = process.argv;
if (!slug || !cmd) {
  console.error('Usage: log.mjs <slug> init|step|final ...');
  process.exit(2);
}

const logPath = join(process.cwd(), 'slides', slug, '.auto-log.md');

function iso() { return new Date().toISOString(); }
function fmt(ms) {
  if (!ms || isNaN(ms)) return '';
  const s = Math.round(ms / 100) / 10;
  return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${Math.round(s%60)}s`;
}

if (cmd === 'init') {
  const [configPath] = rest;
  if (!configPath || !existsSync(configPath)) {
    console.error('init: config path required and must exist');
    process.exit(2);
  }
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const rows = [];
  const keys = [
    'topic', 'preset', 'audience', 'narrative_pattern', 'tone',
    'length', 'memory_sentence', 'track', 'theme',
    'refine_iterations', 'export', 'pptx_editable',
  ];
  for (const k of keys) {
    const v = config[k];
    const display = Array.isArray(v) ? v.join(', ') : (typeof v === 'boolean' ? (v ? 'yes' : 'no') : (v ?? ''));
    const source = (k === 'length' || k === 'memory_sentence' || k === 'theme' || k === 'topic') ? 'user' : 'preset';
    rows.push(`| ${k} | ${display} | ${source} |`);
  }

  const body = `# Autopilot Log — ${slug}

- **Started**: ${iso()}
- **Mode**: ${config.mode}
- **Preset**: ${config.preset} (${config.preset_label})

## Decisions captured at setup

| field | value | source |
|-------|-------|--------|
${rows.join('\n')}

## Pipeline

`;
  writeFileSync(logPath, body);
  console.log('✓ log initialized');
  process.exit(0);
}

if (cmd === 'step') {
  const [name, status, detail, durationMs] = rest;
  if (!name || !status) {
    console.error('step: requires name and status');
    process.exit(2);
  }
  const icon = { ok: '✓', fail: '✗', warn: '⚠' }[status] || '·';
  const dur = durationMs ? ` (${fmt(Number(durationMs))})` : '';
  const line = `- ${icon} ${name}${dur}${detail ? ' — ' + detail : ''}\n`;
  appendFileSync(logPath, line);
  console.log(line.trim());
  process.exit(0);
}

if (cmd === 'final') {
  const [status] = rest;
  appendFileSync(logPath, `\n## Final state\n\n- **Status**: ${status}\n- **Ended**: ${iso()}\n`);
  console.log(`✓ log finalized (${status})`);
  process.exit(0);
}

console.error(`unknown command: ${cmd}`);
process.exit(2);
