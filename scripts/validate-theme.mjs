#!/usr/bin/env node
// Validate a generated Marpit theme CSS against the Theme-Foundry spec.
// Usage: node validate-theme.mjs <path-to-theme.css>
// Exits 0 if valid, non-zero with a report if not.

import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';

const cssPath = process.argv[2];
if (!cssPath || !existsSync(cssPath)) {
  console.error(`Usage: validate-theme.mjs <theme.css>\nNot found: ${cssPath ?? '(missing)'}`);
  process.exit(2);
}

const css = readFileSync(cssPath, 'utf8');
const name = basename(cssPath);
const head = css.slice(0, 400);

const REQUIRED_COLOR_TOKENS = [
  '--bg', '--bg-inv', '--fg', '--fg-inv',
  '--muted', '--rule', '--accent', '--accent-ink',
];
const REQUIRED_FONT_TOKENS = ['--font-body', '--font-display', '--font-mono'];
const REQUIRED_SCALE_TOKENS = [
  '--fs-display', '--fs-headline', '--fs-subhead',
  '--fs-body-l', '--fs-body', '--fs-caption',
];
const REQUIRED_LH_TOKENS = ['--lh-display', '--lh-headline', '--lh-body'];
const REQUIRED_LAYOUTS = [
  'section.hero',
  'section.monumental',
  'section.split',
  'section.metric',
  'section.divider',
  'section.quote',
  'section.enumerated',
];

const errors = [];
const warnings = [];

// 1. @theme declaration
const themeMatch = head.match(/^\s*\/\*\s*@theme\s+([a-z0-9][a-z0-9._-]*)\s*\*\//m);
if (!themeMatch) {
  errors.push('Missing `/* @theme <name> */` declaration in first ~400 chars');
} else if (!/^[a-z0-9][a-z0-9._-]*$/.test(themeMatch[1])) {
  errors.push(`Invalid theme name "${themeMatch[1]}" — must be lowercase kebab-case`);
}

// 2. Required tokens in :root
// Strip /* ... */ comments so braces inside them don't break brace matching
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
const rootBlockMatch = extractBalancedBlock(cssNoComments, /:root\s*\{/);
if (!rootBlockMatch) {
  errors.push('No :root block found — tokens must be declared in :root');
} else {
  const rootBlock = rootBlockMatch;
  for (const token of [...REQUIRED_COLOR_TOKENS, ...REQUIRED_FONT_TOKENS, ...REQUIRED_SCALE_TOKENS, ...REQUIRED_LH_TOKENS]) {
    const re = new RegExp(`${token.replace(/-/g, '\\-')}\\s*:`);
    if (!re.test(rootBlock)) {
      errors.push(`Missing token in :root → ${token}`);
    }
  }

  // Body line-height must be ≥ 1.6 for Korean readability
  const lhBodyMatch = rootBlock.match(/--lh-body\s*:\s*([^;]+);/);
  if (lhBodyMatch) {
    const value = parseFloat(lhBodyMatch[1].trim());
    if (!isNaN(value) && value < 1.6) {
      errors.push(`--lh-body is ${value} — must be ≥ 1.6 for Korean body`);
    }
  }
}

// 3. Required layout classes
for (const layout of REQUIRED_LAYOUTS) {
  const re = new RegExp(layout.replace(/\./g, '\\.') + '\\b');
  if (!re.test(css)) {
    errors.push(`Missing layout selector → ${layout}`);
  }
}

// 4. Split variants present (at least one)
if (!/section\.split-\d{2}-\d{2}/.test(css)) {
  warnings.push('No split variants (split-60-40, split-55-45, split-40-60) — deck composer will use default gap');
}

// 5. Korean typography safeguards
// 5a. Must not globally uppercase body
const sectionRule = css.match(/^section\s*\{[\s\S]*?\}/m);
if (sectionRule && /text-transform\s*:\s*uppercase/.test(sectionRule[0])) {
  errors.push('`section { text-transform: uppercase }` applied globally — breaks Korean text');
}

// 5b. CJK font requirement — either direct Pretendard/Noto reference OR theme-foundation import
const hasFoundation = /@import\s+url\(['"][^'"]*theme-foundation\.css['"]/i.test(css);
const hasCjkFont = /Pretendard|Noto Sans (JP|SC|TC|KR)/i.test(css);
if (!hasFoundation && !hasCjkFont) {
  errors.push('No CJK font reference — either import theme-foundation.css or declare Pretendard/Noto Sans JP/SC/TC/KR directly');
}

// 5c. Should have at least one font-loading directive — CDN @import, @font-face, offline bundle, or theme-foundation
const hasImport = /@import\s+url\(['"]?https?:/.test(css);
const hasFontFace = /@font-face/.test(css);
const hasLocalImport = /@import\s+url\(['"]?\.\.\/\.\.\/fonts\/offline/.test(css);
if (!hasImport && !hasFontFace && !hasLocalImport && !hasFoundation) {
  warnings.push('No @import or @font-face — fonts will not load unless theme relies on system fallback');
}

// 6. Attribution comment in first ~500 chars
const hasAttribution = /theme-forger|Inspired by|Not affiliated/i.test(css.slice(0, 500));
if (!hasAttribution) {
  warnings.push('No attribution comment in header (Rule 8 — Inspired by <brand>, Not affiliated)');
}

// 7. Forbid !important
if (/!\s*important/.test(css)) {
  warnings.push('`!important` used somewhere — should be unnecessary in a theme');
}

// ──────── Report ────────
const ok = errors.length === 0;
console.log(`\n◆ validate-theme: ${name}`);
console.log(`  ${ok ? '✓ PASS' : '✗ FAIL'} · ${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length) {
  console.log('\nErrors:');
  for (const e of errors) console.log('  ✗ ' + e);
}
if (warnings.length) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log('  ⚠ ' + w);
}
console.log('');
process.exit(ok ? 0 : 1);

// ── Helpers ────────────────────────────────────────────────────
function extractBalancedBlock(text, openingRegex) {
  const m = text.match(openingRegex);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  const start = i;
  while (i < text.length && depth > 0) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    i++;
  }
  if (depth !== 0) return null;
  return text.substring(start, i - 1);
}
