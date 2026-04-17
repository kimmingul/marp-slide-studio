#!/usr/bin/env node
// Marp Slide Studio — programmatic assertions on a rendered slide deck.
//
// Verifies structural + typographic invariants that should always hold:
//   1. Slide count matches brief.md (if present)
//   2. <html lang="..."> attribute set and matches brief/deck config
//   3. Every <section> is non-empty
//   4. No 3 consecutive sections with identical _class (layout rhythm)
//   5. Accent color appears on at most N slides (per brief or default 3/10)
//   6. Body font-size ≥ 22px for CJK langs, ≥ 20px for Latin
//   7. No italicized Korean/Japanese/Chinese native text (element with :lang AND italic)
//   8. No <img> with empty or missing src
//
// Usage: node slide-assertions.mjs <slug> [--strict]
//   exits 0 on all PASS; 1 on any FAIL; 2 on arg error

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [, , slug, ...flags] = process.argv;
if (!slug) {
  console.error('Usage: slide-assertions.mjs <slug> [--strict]');
  process.exit(2);
}
const strict = flags.includes('--strict');

const deckDir = resolve(process.cwd(), 'slides', slug);
const briefPath = join(deckDir, 'brief.md');
const deckMdPath = join(deckDir, 'deck.md');
const htmlPath = join(deckDir, 'out', 'deck.html');

if (!existsSync(htmlPath)) {
  console.error(`✗ ${htmlPath} not found. Run render.sh first.`);
  process.exit(2);
}

const html = readFileSync(htmlPath, 'utf8');
const deckMd = existsSync(deckMdPath) ? readFileSync(deckMdPath, 'utf8') : '';
const brief = existsSync(briefPath) ? readFileSync(briefPath, 'utf8') : '';

const pass = [];
const fail = [];
const warn = [];

// ── 1. Slide count ────────────────────────────────────────
const sectionMatches = html.match(/<section[^>]*>/g) || [];
const slideCount = sectionMatches.length;
const briefLenMatch = brief.match(/^length_target:\s*(\d+)/m) || brief.match(/^length:\s*(\d+)/m);
const expectedSlides = briefLenMatch ? parseInt(briefLenMatch[1], 10) : null;
if (expectedSlides && Math.abs(slideCount - expectedSlides) > 2) {
  fail.push(`slide count ${slideCount} differs from brief length_target ${expectedSlides} by more than 2`);
} else {
  pass.push(`slide count: ${slideCount}${expectedSlides ? ` (target ${expectedSlides})` : ''}`);
}

// ── 2. html lang attribute ────────────────────────────────
const langMatch = html.match(/<html[^>]*\blang="([^"]+)"/);
const deckLangMatch = deckMd.match(/^lang:\s*([a-zA-Z-]+)/m);
const expectedLang = deckLangMatch ? deckLangMatch[1].trim() : null;
if (!langMatch) {
  (strict ? fail : warn).push('no <html lang="..."> attribute — per-language typography cascade may not trigger');
} else if (expectedLang && langMatch[1] !== expectedLang && !langMatch[1].startsWith(expectedLang)) {
  warn.push(`html lang="${langMatch[1]}" differs from deck front matter lang: ${expectedLang}`);
} else {
  pass.push(`html lang="${langMatch[1]}"`);
}

// ── 3. No empty sections ──────────────────────────────────
const sectionBodies = [...html.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/g)];
let emptySections = 0;
for (const [, body] of sectionBodies) {
  const stripped = body.replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();
  if (stripped.length < 3) emptySections++;
}
if (emptySections > 0) {
  (strict ? fail : warn).push(`${emptySections} section(s) appear empty (under 3 visible chars)`);
} else {
  pass.push('all sections non-empty');
}

// ── 4. Layout rhythm: no 3 consecutive same _class ───────
const classes = sectionMatches.map(s => {
  const m = s.match(/\bdata-class="([^"]+)"|\bclass="([^"]*)"/);
  return m ? (m[1] || m[2]).split(/\s+/)[0] : '';
}).filter(Boolean);
let streak = 1, maxStreak = 1, streakClass = classes[0];
for (let i = 1; i < classes.length; i++) {
  if (classes[i] === classes[i - 1]) { streak++; if (streak > maxStreak) { maxStreak = streak; streakClass = classes[i]; } }
  else streak = 1;
}
if (maxStreak >= 3) {
  warn.push(`layout rhythm: ${maxStreak} consecutive "${streakClass}" slides (max should be 2)`);
} else {
  pass.push(`layout rhythm: max ${maxStreak} consecutive same-class slides`);
}

// ── 5. Accent usage (count slides where theme accent var appears) ────────
// Scan the <style> block for --accent value, then count its occurrences in sections
const accentMatch = html.match(/--accent:\s*([^;]+);/);
if (accentMatch) {
  const accent = accentMatch[1].trim();
  // Count how many sections have accent explicitly or have elements using the accent color
  let accentSlides = 0;
  for (const [full, body] of sectionBodies) {
    if (body.includes(accent) || full.includes(accent)) accentSlides++;
  }
  const limit = Math.ceil(slideCount * 0.4); // 40% cap — loose check
  if (accentSlides > limit) {
    warn.push(`accent color ${accent} appears on ${accentSlides}/${slideCount} slides (loose cap ${limit})`);
  } else {
    pass.push(`accent discipline: ${accentSlides}/${slideCount} slides reference --accent`);
  }
}

// ── 6. Body font-size floor check (via CSS inspection) ───
const fsBodyMatch = html.match(/--fs-body:\s*([^;]+);/);
if (fsBodyMatch) {
  const clampMatch = fsBodyMatch[1].match(/clamp\(\s*(\d+)px/);
  if (clampMatch) {
    const floor = parseInt(clampMatch[1], 10);
    const isCjk = expectedLang && /^(ko|ja|zh)/.test(expectedLang);
    const minFloor = isCjk ? 22 : 20;
    if (floor < minFloor) {
      fail.push(`--fs-body floor ${floor}px is below ${minFloor}px required for ${isCjk ? 'CJK' : 'Latin'} body`);
    } else {
      pass.push(`--fs-body floor: ${floor}px (min required ${minFloor}px)`);
    }
  }
}

// ── 7. Italicized native CJK ─────────────────────────────
// Heuristic: find <em> with lang="ko|ja|zh-*" nested directly, which would trigger italic
const emCjkMatches = [...html.matchAll(/<em[^>]*>([\u3131-\uD7A3\u3040-\u30FF\u4E00-\u9FFF][^<]*)<\/em>/g)];
if (emCjkMatches.length > 0 && !html.includes('section:lang(ko) em')) {
  fail.push(`${emCjkMatches.length} <em> elements contain CJK characters without :lang() italic-off rule`);
} else if (emCjkMatches.length > 0) {
  pass.push(`${emCjkMatches.length} <em> with CJK content — foundation :lang() rule guards italic`);
} else {
  pass.push('no italicized CJK detected');
}

// ── 8. Images have src ─────────────────────────────────
const imgMatches = [...html.matchAll(/<img[^>]*>/g)];
let brokenImgs = 0;
for (const [full] of imgMatches) {
  const srcMatch = full.match(/\bsrc=["']?([^"'\s>]*)/);
  if (!srcMatch || !srcMatch[1] || srcMatch[1] === '#') brokenImgs++;
}
if (brokenImgs > 0) {
  fail.push(`${brokenImgs} <img> element(s) missing valid src`);
} else if (imgMatches.length > 0) {
  pass.push(`${imgMatches.length} <img> elements with valid src`);
}

// ── Report ──────────────────────────────────────────────
console.log(`\n◆ slide-assertions: ${slug}${strict ? ' (strict)' : ''}`);
console.log(`  ${fail.length === 0 ? '✓ PASS' : '✗ FAIL'} · ${pass.length} passed, ${warn.length} warnings, ${fail.length} failures\n`);

if (pass.length) {
  console.log('Passed:');
  for (const p of pass) console.log('  ✓ ' + p);
  console.log('');
}
if (warn.length) {
  console.log('Warnings:');
  for (const w of warn) console.log('  ⚠ ' + w);
  console.log('');
}
if (fail.length) {
  console.log('Failures:');
  for (const f of fail) console.log('  ✗ ' + f);
  console.log('');
}

process.exit(fail.length === 0 ? 0 : 1);
