#!/usr/bin/env node
// Per-slide screenshot for visual QA.
// Usage: node screenshot.mjs <slug> [viewport=1920x1080]
//
// Requires the deck already rendered to ./slides/<slug>/out/deck.html.
// Outputs PNGs to ./slides/<slug>/out/screenshots/slide-NN.png
//
// Uses Playwright if installed locally; otherwise exits with a helpful message.

import { existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , slug, viewportArg = '1920x1080'] = process.argv;
if (!slug) {
  console.error('Usage: screenshot.mjs <slug> [viewport=1920x1080]');
  process.exit(2);
}

const [w, h] = viewportArg.split('x').map(Number);
const deckDir = resolve(process.cwd(), 'slides', slug);
const htmlPath = join(deckDir, 'out', 'deck.html');
const shotDir = join(deckDir, 'out', 'screenshots');

if (!existsSync(htmlPath)) {
  console.error(`✗ ${htmlPath} not found. Run render.sh first.`);
  process.exit(1);
}
mkdirSync(shotDir, { recursive: true });

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('✗ Playwright not installed in this project.');
  console.error('  Install once: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: w, height: h } });
const page = await context.newPage();

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });

// Marp outputs <section> per slide inside a container. Each section is one slide.
const slides = await page.$$('section');
console.log(`○ ${slides.length} slides found`);

for (let i = 0; i < slides.length; i++) {
  // Scroll that section to the viewport and capture just it.
  const box = await slides[i].boundingBox();
  if (!box) continue;
  const n = String(i + 1).padStart(2, '0');
  const out = join(shotDir, `slide-${n}.png`);
  await slides[i].screenshot({ path: out });
  console.log(`✓ ${out}`);
}

await browser.close();
