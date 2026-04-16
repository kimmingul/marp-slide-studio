#!/usr/bin/env node
// Compare per-slide screenshots between two directories using pixelmatch.
// Writes a diff summary to stdout in GitHub-markdown format.
//
// Usage: screenshot-diff.mjs <base-dir> <head-dir> <out-dir> <slug>

import { readdirSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const [, , baseDir, headDir, outDir, slug] = process.argv;
if (!baseDir || !headDir || !outDir || !slug) {
  console.error('Usage: screenshot-diff.mjs <base-dir> <head-dir> <out-dir> <slug>');
  process.exit(2);
}

const { PNG } = await import('pngjs');
const pixelmatch = (await import('pixelmatch')).default;

mkdirSync(outDir, { recursive: true });

const baseFiles = existsSync(baseDir) ? readdirSync(baseDir).filter(f => f.endsWith('.png')).sort() : [];
const headFiles = existsSync(headDir) ? readdirSync(headDir).filter(f => f.endsWith('.png')).sort() : [];
const all = Array.from(new Set([...baseFiles, ...headFiles])).sort();

const rows = [];
let totalChanged = 0;
let totalAdded = 0;
let totalRemoved = 0;

for (const name of all) {
  const basePath = join(baseDir, name);
  const headPath = join(headDir, name);
  const diffPath = join(outDir, name);

  const hasBase = existsSync(basePath);
  const hasHead = existsSync(headPath);

  if (!hasBase && hasHead) {
    rows.push(`| ${name} | 🟢 new | — |`);
    totalAdded++;
    continue;
  }
  if (hasBase && !hasHead) {
    rows.push(`| ${name} | 🔴 removed | — |`);
    totalRemoved++;
    continue;
  }

  const img1 = PNG.sync.read(readFileSync(basePath));
  const img2 = PNG.sync.read(readFileSync(headPath));

  if (img1.width !== img2.width || img1.height !== img2.height) {
    rows.push(`| ${name} | ⚠️ size-change | ${img1.width}×${img1.height} → ${img2.width}×${img2.height} |`);
    totalChanged++;
    continue;
  }

  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.15,
    alpha: 0.1,
    includeAA: false,
  });
  const pct = ((mismatched / (width * height)) * 100).toFixed(2);

  if (mismatched === 0) {
    rows.push(`| ${name} | ⚪ unchanged | 0.00% |`);
  } else {
    writeFileSync(diffPath, PNG.sync.write(diff));
    rows.push(`| ${name} | 🟡 changed | ${pct}% |`);
    totalChanged++;
  }
}

console.log(`\n### \`${slug}\`\n`);
console.log(`| Slide | Status | Pixel diff |`);
console.log(`|-------|--------|------------|`);
for (const r of rows) console.log(r);
console.log(``);
console.log(`**Summary:** ${totalChanged} changed, ${totalAdded} new, ${totalRemoved} removed (out of ${all.length} slides)`);
console.log(``);
