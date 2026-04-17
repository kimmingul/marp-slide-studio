#!/usr/bin/env node
// Marp Slide Studio — record a video of a rendered deck for QA / preview.
//
// Uses Playwright's built-in recordVideo option. Navigates through all slides
// with 2s pauses between each, producing a WebM video of slide transitions.
//
// Usage:
//   node record-deck.mjs <slug> [--seconds <per-slide=2>] [--output <path>]
//
// Output: slides/<slug>/out/deck.webm (or --output path)
//
// Requires Playwright installed locally (npm i -D playwright + npx playwright install chromium).

import { existsSync, mkdirSync, renameSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const argv = process.argv.slice(2);
if (!argv[0] || argv.includes('--help') || argv.includes('-h')) {
  console.log(`Usage: record-deck.mjs <slug> [--seconds <n>] [--output <path>]
  --seconds <n>   seconds to hold each slide (default 2)
  --output <path> override output (default: slides/<slug>/out/deck.webm)`);
  process.exit(argv[0] ? 0 : 2);
}

const slug = argv[0];
const secondsIdx = argv.indexOf('--seconds');
const perSlideSec = secondsIdx >= 0 ? parseFloat(argv[secondsIdx + 1]) : 2;
const outputIdx = argv.indexOf('--output');
const explicitOutput = outputIdx >= 0 ? argv[outputIdx + 1] : null;

const deckDir = resolve(process.cwd(), 'slides', slug);
const htmlPath = join(deckDir, 'out', 'deck.html');
const outDir = join(deckDir, 'out');
const finalOutput = explicitOutput || join(outDir, 'deck.webm');

if (!existsSync(htmlPath)) {
  console.error(`Error: ${htmlPath} not found. Run render.sh first.`);
  process.exit(1);
}
mkdirSync(dirname(finalOutput), { recursive: true });

let playwright;
try {
  playwright = await import('playwright');
} catch {
  console.error('Playwright not installed. Install with: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}
const { chromium } = playwright;

// Playwright writes videos to a directory; we move the result into place
const videoTmpDir = join(outDir, '.video-tmp');
mkdirSync(videoTmpDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: videoTmpDir, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();

await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const slideCount = await page.evaluate(() => document.querySelectorAll('section').length);
console.log(`Found ${slideCount} slides, recording ${perSlideSec}s each…`);

// Hold the first slide, then navigate with ArrowRight
await page.waitForTimeout(perSlideSec * 1000);
for (let i = 1; i < slideCount; i++) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(perSlideSec * 1000);
}
await page.waitForTimeout(500);

await page.close();
await context.close();
await browser.close();

// Move the recorded video into place
const recorded = readdirSync(videoTmpDir).filter(f => f.endsWith('.webm'));
if (recorded.length === 0) {
  console.error('No video produced');
  process.exit(1);
}
const newest = recorded
  .map(f => ({ f, mtime: statSync(join(videoTmpDir, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime)[0].f;

renameSync(join(videoTmpDir, newest), finalOutput);
for (const f of readdirSync(videoTmpDir)) unlinkSync(join(videoTmpDir, f));
try { rmdirSync(videoTmpDir); } catch { /* ignore */ }

const totalSec = (slideCount * perSlideSec + 0.5).toFixed(1);
console.log(`Recorded ${totalSec}s video → ${finalOutput}`);
