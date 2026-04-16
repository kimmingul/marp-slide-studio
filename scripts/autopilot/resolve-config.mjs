#!/usr/bin/env node
// Autopilot config resolver.
// Merges preset + user answers into a single config JSON written to stdout.
//
// Usage:
//   resolve-config.mjs --preset investor-pitch --topic "..." \
//     --slug "..." --length standard --memory "..."
//   resolve-config.mjs --preset investor-pitch --topic "..." \
//     --slug "..." --config-json '{"field":"override"}'   # Full mode overrides

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, '..', '..');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) out[a.slice(2)] = argv[++i];
  }
  return out;
}

function die(msg, code = 1) {
  console.error('resolve-config: ' + msg);
  process.exit(code);
}

const args = parseArgs(process.argv.slice(2));
if (!args.preset) die('--preset required');
if (!args.topic) die('--topic required');
if (!args.slug) die('--slug required');

const presetsPath = join(PLUGIN_ROOT, 'assets', 'autopilot-presets.json');
if (!existsSync(presetsPath)) die(`presets file missing: ${presetsPath}`);
const PRESETS = JSON.parse(readFileSync(presetsPath, 'utf8'));

const preset = PRESETS.presets[args.preset];
if (!preset) {
  const names = Object.keys(PRESETS.presets).join(', ');
  die(`unknown preset "${args.preset}". Available: ${names}`);
}

// Length mapping
const lengthKey = args.length || 'standard';
const lengthProfile = PRESETS.length_profiles[lengthKey];
if (!lengthProfile) die(`unknown length "${lengthKey}"`);

// Base config from preset
const config = {
  mode: args.mode || 'express',
  topic: args.topic,
  slug: args.slug,
  preset: args.preset,
  preset_label: preset.label,

  audience: preset.audience,
  narrative_pattern: preset.narrative_pattern,
  tone: preset.tone,
  differentiation_against: preset.differentiation_against,

  length: lengthProfile.slides,
  memory_sentence: args.memory || '',

  track: preset.track,
  theme: args.forceTheme || preset.theme,
  theme_customization: preset.theme_customization || {},

  composition_hints: preset.composition_hints || {},

  refine_iterations: args.noRefine === 'true' ? 0 : preset.refine_iterations,

  export: preset.export.slice(),
  pptx_editable: !!preset.pptx_editable,

  created: new Date().toISOString(),
};

// Full-mode override JSON (optional)
if (args['config-json']) {
  try {
    const overrides = JSON.parse(args['config-json']);
    for (const [k, v] of Object.entries(overrides)) {
      if (v != null && v !== '') config[k] = v;
    }
  } catch (e) {
    die(`--config-json is not valid JSON: ${e.message}`);
  }
}

// Validation: memory sentence must exist (defaults empty string is OK,
// but the downstream generator checks; here we only warn if empty)
if (!config.memory_sentence) {
  // Not fatal — emit to stderr so Claude sees the hint
  console.error('resolve-config: warning: memory_sentence is empty. Close slide will use topic.');
}

console.log(JSON.stringify(config, null, 2));
