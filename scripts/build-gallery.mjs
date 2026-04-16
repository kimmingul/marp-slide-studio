#!/usr/bin/env node
// Build the theme gallery: render the sampler deck with every cached theme,
// capture per-slide thumbnails, and emit a filterable HTML grid.
//
// Usage:
//   node build-gallery.mjs              # default target ~/.marp-slide-studio/gallery
//   node build-gallery.mjs --out <dir>  # custom output dir
//   node build-gallery.mjs --only <slug>[,<slug>...]  # rebuild specific themes
//   node build-gallery.mjs --refresh    # ignore existing cache, redo everything
//
// Prerequisites:
//   - npx @marp-team/marp-cli@latest (fetched at runtime)
//   - Playwright chromium (optional; on-demand cards still work without it)

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { homedir, tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, '..');

// ── Args ────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
const OUT_DIR = args.out || join(homedir(), '.marp-slide-studio', 'gallery');
const ONLY = args.only ? args.only.split(',').map(s => s.trim()) : null;
const REFRESH = !!args.refresh;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--refresh') out.refresh = true;
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--only') out.only = argv[++i];
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
  }
  return out;
}

function printHelp() {
  console.log(`Usage:
  build-gallery.mjs                        # default ~/.marp-slide-studio/gallery
  build-gallery.mjs --out <dir>            # custom output directory
  build-gallery.mjs --only slug1,slug2     # rebuild only these themes
  build-gallery.mjs --refresh              # ignore cache, redo all
`);
}

// ── Load sources ────────────────────────────────────────────────
const registryPath = join(PLUGIN_ROOT, 'assets', 'design-systems', 'registry.json');
if (!existsSync(registryPath)) die(`Registry not found: ${registryPath}`);
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));

const samplerDeck = join(PLUGIN_ROOT, 'examples', 'gallery-sampler', 'deck.md');
if (!existsSync(samplerDeck)) die(`Sampler deck not found: ${samplerDeck}`);
const samplerSource = readFileSync(samplerDeck, 'utf8');

const templateDir = join(PLUGIN_ROOT, 'scripts', 'gallery', 'template');
for (const f of ['index.template.html', 'gallery.css', 'gallery.js']) {
  if (!existsSync(join(templateDir, f))) die(`Template missing: ${f}`);
}

// ── Output dirs ─────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
const thumbsDir = join(OUT_DIR, 'thumbnails');
const samplerDir = join(OUT_DIR, 'sampler');
mkdirSync(thumbsDir, { recursive: true });
mkdirSync(samplerDir, { recursive: true });

// ── Enumerate all themes ────────────────────────────────────────
const CURATED_DIRS = [
  ['minimalist-premium', 'minimalist-premium'],
  ['editorial', 'editorial'],
];
const curated = [];
for (const [track, dir] of CURATED_DIRS) {
  const full = join(PLUGIN_ROOT, 'assets', 'design-systems', dir);
  if (!existsSync(full)) continue;
  for (const f of readdirSync(full)) {
    if (!f.endsWith('.marp.css')) continue;
    const slug = f.replace(/\.marp\.css$/, '');
    curated.push({
      slug, name: slug, tier: 'curated', track,
      cssPath: join(full, f),
      mood: readMoodFromDesignMd(join(full, slug + '.design.md')),
    });
  }
}

const genDir = join(PLUGIN_ROOT, 'assets', 'design-systems', 'generated');
const generatedSlugs = new Set();
if (existsSync(genDir)) {
  for (const f of readdirSync(genDir)) {
    if (!f.endsWith('.marp.css')) continue;
    generatedSlugs.add(f.replace(/\.marp\.css$/, ''));
  }
}

const fromRegistry = [];
for (const [brand, meta] of Object.entries(registry.brands)) {
  const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const cached = generatedSlugs.has(slug);
  fromRegistry.push({
    slug,
    name: brand,
    tier: cached ? 'generated' : 'on-demand',
    track: meta.suggested_track,
    category: meta.category,
    density: meta.signature.density,
    mood: meta.mood,
    palette: meta.signature.palette,
    hallmarks: meta.signature.hallmarks,
    cssPath: cached ? join(genDir, slug + '.marp.css') : null,
  });
}

const allThemes = [...curated, ...fromRegistry];
const targetThemes = ONLY
  ? allThemes.filter(t => ONLY.includes(t.slug))
  : allThemes;

log(`themes total: ${allThemes.length} (curated ${curated.length}, generated ${[...generatedSlugs].length}, on-demand ${fromRegistry.filter(t => t.tier === 'on-demand').length})`);
log(`output: ${OUT_DIR}`);

// ── Render each renderable theme ────────────────────────────────
const renderableThemes = targetThemes.filter(t => t.cssPath);
const manifest = { builtAt: new Date().toISOString(), themes: [] };

for (let i = 0; i < renderableThemes.length; i++) {
  const t = renderableThemes[i];
  const prefix = `[${i + 1}/${renderableThemes.length}] ${t.slug}`;
  const thumbBase = join(thumbsDir, t.slug);
  const samplerOut = join(samplerDir, t.slug);

  if (!REFRESH && existsSync(join(thumbBase, 'slide-01.png')) && existsSync(join(samplerOut, 'deck.html'))) {
    log(`${prefix} · cached, skipping render`);
    continue;
  }
  mkdirSync(thumbBase, { recursive: true });
  mkdirSync(samplerOut, { recursive: true });

  // 1. substitute THEME_SLUG in sampler deck
  const themeSlug = readThemeSlugFromCss(t.cssPath) || t.slug;
  const deckContents = samplerSource.replace(/^theme:\s*THEME_SLUG/m, `theme: ${themeSlug}`);
  const deckPath = join(samplerOut, 'deck.md');
  writeFileSync(deckPath, deckContents);

  // Copy theme css alongside (so marp-cli --theme-set resolves relative)
  const themeCssDst = join(samplerOut, 'theme.css');
  cpSync(t.cssPath, themeCssDst);

  // 2. render HTML (for modal "open full HTML" link)
  const marpHtml = join(samplerOut, 'deck.html');
  const marpHtmlRun = spawnSync('npx', [
    '--yes', '@marp-team/marp-cli@latest',
    '--theme-set', themeCssDst,
    '--html', '--allow-local-files',
    '-o', marpHtml,
    deckPath,
  ], { stdio: 'inherit' });
  if (marpHtmlRun.status !== 0) {
    log(`${prefix} · ✗ marp HTML render failed (status ${marpHtmlRun.status}); skipping`);
    continue;
  }

  // 3. render per-slide PNGs using marp --images
  // marp-cli writes <outbase>.001.png, <outbase>.002.png, ...
  const imgBase = join(thumbBase, 'slide');
  const marpPng = spawnSync('npx', [
    '--yes', '@marp-team/marp-cli@latest',
    '--theme-set', themeCssDst,
    '--images', 'png',
    '--image-scale', '0.5',
    '--allow-local-files',
    '-o', imgBase + '.png',
    deckPath,
  ], { stdio: 'inherit' });
  if (marpPng.status !== 0) {
    log(`${prefix} · ⚠ PNG render failed (status ${marpPng.status}); card will show swatches only`);
    continue;
  }

  // Normalize filenames — marp writes slide.001.png, we want slide-01.png
  for (const f of readdirSync(thumbBase)) {
    const m = f.match(/^slide\.(\d+)\.png$/);
    if (!m) continue;
    const n = String(parseInt(m[1], 10)).padStart(2, '0');
    const src = join(thumbBase, f);
    const dst = join(thumbBase, `slide-${n}.png`);
    if (src !== dst) {
      cpSync(src, dst);
      rmSync(src);
    }
  }
  log(`${prefix} · ✓ rendered + per-slide PNG`);
}

// ── Assemble manifest.themes in display order ───────────────────
for (const t of allThemes) {
  const slidesDir = join(thumbsDir, t.slug);
  const slides = [];
  if (existsSync(slidesDir)) {
    for (const f of readdirSync(slidesDir).sort()) {
      if (f.endsWith('.png')) slides.push(`thumbnails/${t.slug}/${f}`);
    }
  }
  manifest.themes.push({
    slug: t.slug,
    name: t.name,
    tier: t.tier,
    track: t.track || null,
    category: t.category || null,
    density: t.density || null,
    mood: t.mood || '',
    palette: t.palette || null,
    hallmarks: t.hallmarks || null,
    thumb: slides[0] || null,
    slides,
    htmlPath: existsSync(join(samplerDir, t.slug, 'deck.html')) ? `sampler/${t.slug}/deck.html` : null,
  });
}

// ── Emit index.html, css, js ────────────────────────────────────
const tpl = readFileSync(join(templateDir, 'index.template.html'), 'utf8');
const dataInlined = tpl.replace(
  /\/\*GALLERY_DATA\*\/null\/\*END_GALLERY_DATA\*\//,
  JSON.stringify(manifest)
);
writeFileSync(join(OUT_DIR, 'index.html'), dataInlined);
cpSync(join(templateDir, 'gallery.css'), join(OUT_DIR, 'gallery.css'));
cpSync(join(templateDir, 'gallery.js'), join(OUT_DIR, 'gallery.js'));
writeFileSync(join(OUT_DIR, 'metadata.json'), JSON.stringify(manifest, null, 2));

log(`✓ gallery written → ${join(OUT_DIR, 'index.html')}`);
log(`  open: file://${join(OUT_DIR, 'index.html')}`);

// ── Helpers ─────────────────────────────────────────────────────
function log(msg) { console.log(msg); }
function die(msg) { console.error('build-gallery: ' + msg); process.exit(1); }

function readMoodFromDesignMd(path) {
  if (!existsSync(path)) return '';
  try {
    const md = readFileSync(path, 'utf8');
    const m = md.match(/\*\*Mood\*\*\s*:\s*([^\n]+)/i)
           || md.match(/^\s*-\s*\*\*Mood\*\*:\s*([^\n]+)/im)
           || md.match(/Mood:\s*([^\n]+)/i);
    return m ? m[1].trim() : '';
  } catch { return ''; }
}

function readThemeSlugFromCss(cssPath) {
  try {
    const head = readFileSync(cssPath, 'utf8').slice(0, 400);
    const m = head.match(/@theme\s+([a-z0-9][a-z0-9._-]*)/);
    return m ? m[1] : null;
  } catch { return null; }
}
