// Marp Slide Studio — Theme Gallery client (vanilla, zero-dep, XSS-safe via DOM methods)

(function () {
  const DATA = window.__GALLERY_DATA__;
  if (!DATA) { console.error('__GALLERY_DATA__ missing'); return; }

  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, ...children) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (k === 'dataset') for (const [dk, dv] of Object.entries(v)) n.dataset[dk] = dv;
      else n.setAttribute(k, v);
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return n;
  };

  const grid = $('grid');
  const totalEl = $('total-count');
  const visibleEl = $('visible-count');
  const modal = $('modal');
  const modalTitle = $('modal-title');
  const modalMeta = $('modal-meta');
  const modalSlides = $('modal-slides');
  const copyBtn = $('copy-cmd');
  const openHtml = $('open-html');

  const filters = { tier: '', track: '', category: '', density: '', q: '' };
  let activeTheme = null;

  // Populate category dropdown
  const catSelect = document.querySelector('select[data-filter="category"]');
  const cats = [...new Set(DATA.themes.map(t => t.category).filter(Boolean))].sort();
  for (const c of cats) catSelect.appendChild(el('option', { value: c, text: c }));

  totalEl.textContent = DATA.themes.length;

  // Filter bindings
  for (const f of document.querySelectorAll('[data-filter]')) {
    f.addEventListener('input', (e) => {
      filters[f.dataset.filter] = String(e.target.value || '').toLowerCase();
      render();
    });
  }
  $('reset-filters').addEventListener('click', () => {
    for (const f of document.querySelectorAll('[data-filter]')) f.value = '';
    for (const k of Object.keys(filters)) filters[k] = '';
    render();
  });

  for (const b of document.querySelectorAll('[data-close]')) b.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  copyBtn.addEventListener('click', () => {
    if (!activeTheme) return;
    const cmd = `/slide-theme ${activeTheme.slug}`;
    navigator.clipboard.writeText(cmd).then(() => {
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy /slide-theme command';
        copyBtn.classList.remove('copied');
      }, 1800);
    });
  });

  function matchesFilters(t) {
    if (filters.tier && t.tier !== filters.tier) return false;
    if (filters.track && t.track !== filters.track) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.density && t.density !== filters.density) return false;
    if (filters.q) {
      const hay = [t.slug, t.name, t.mood, ...(t.hallmarks || [])].join(' ').toLowerCase();
      if (!hay.includes(filters.q)) return false;
    }
    return true;
  }

  function render() {
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    const rows = DATA.themes.filter(matchesFilters);
    const groups = {
      curated: { label: 'Curated (Tier 2)', list: [] },
      generated: { label: 'Generated (Tier 3 · cached)', list: [] },
      'on-demand': { label: 'On-demand (forge first to see full render)', list: [] },
    };
    for (const t of rows) (groups[t.tier] || groups['on-demand']).list.push(t);

    let shown = 0;
    for (const [, g] of Object.entries(groups)) {
      if (!g.list.length) continue;
      const head = el('h2', { class: 'group-head', text: `${g.label} · ${g.list.length}` });
      head.style.gridColumn = '1 / -1';
      head.style.margin = '1rem 0 0.25rem';
      head.style.color = 'var(--fg-dim)';
      head.style.fontFamily = 'var(--font-mono)';
      head.style.fontSize = '0.82em';
      head.style.letterSpacing = '0.08em';
      head.style.textTransform = 'uppercase';
      head.style.fontWeight = '500';
      grid.appendChild(head);
      for (const t of g.list) { grid.appendChild(renderCard(t)); shown++; }
    }

    if (!rows.length) {
      grid.appendChild(el('div', { class: 'empty-state', text: 'No themes match the current filters.' }));
    }
    visibleEl.textContent = shown;
  }

  function renderCard(t) {
    // Thumb
    let thumbInner;
    if (t.thumb) {
      thumbInner = el('img', { loading: 'lazy', src: t.thumb, alt: `${t.name} hero slide` });
    } else if (t.palette?.length) {
      const sw = el('div', { class: 'swatches' });
      for (const c of t.palette) {
        const span = document.createElement('span');
        span.style.background = c;
        sw.appendChild(span);
      }
      thumbInner = sw;
    } else {
      thumbInner = el('div');
    }
    const thumb = el('div', { class: 'thumb' }, thumbInner);

    // Head
    const head = el('div', { class: 'head' },
      el('h3', { text: t.name }),
      el('span', { class: 'tier', text: t.tier })
    );

    // Meta chips
    const meta = el('div', { class: 'meta' });
    for (const chip of [t.track, t.category, t.density].filter(Boolean)) {
      meta.appendChild(el('span', { class: 'chip', text: chip }));
    }

    // Description
    const desc = el('div', { class: 'desc', text: t.mood || '' });

    // Actions
    // Primary  : Use (cached) or Forge (on-demand) — copies /slide-theme <slug> to clipboard
    // Secondary: Details — opens modal with 7 sampler slides (cached) or palette+meta (on-demand)
    const actions = el('div', { class: 'actions' });
    const isOnDemand = t.tier === 'on-demand';
    const primary = el('button', {
      type: 'button',
      class: 'primary',
      'data-act': isOnDemand ? 'forge' : 'use',
      title: isOnDemand
        ? 'Copy /slide-theme ' + t.slug + ' — paste in Claude Code to generate'
        : 'Copy /slide-theme ' + t.slug + ' — paste in Claude Code to apply',
      text: isOnDemand ? '⚡ Forge' : 'Use',
    });
    const secondary = el('button', {
      type: 'button',
      'data-act': 'details',
      title: isOnDemand
        ? 'Open details (palette, mood, hallmarks)'
        : 'Open details (all 7 sampler slides)',
      text: 'Details',
    });
    actions.appendChild(primary);
    actions.appendChild(secondary);

    const card = el('div', { class: 'card', 'data-tier': t.tier, 'data-slug': t.slug },
      thumb, head, meta, desc, actions
    );

    card.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      const act = btn?.dataset.act;
      if (act === 'use' || act === 'forge') {
        e.stopPropagation();
        copySlideCommand(t, btn);
        return;
      }
      // 'details' button OR click on card background → open modal
      openModal(t);
    });
    return card;
  }

  function copySlideCommand(theme, btn) {
    const cmd = `/slide-theme ${theme.slug}`;
    navigator.clipboard.writeText(cmd).then(
      () => flashCopied(btn, theme),
      () => { btn.textContent = '✗ Copy failed'; }
    );
  }

  function flashCopied(btn, theme) {
    const isForge = btn.dataset.act === 'forge';
    const original = isForge ? '⚡ Forge' : 'Use';
    btn.textContent = isForge ? 'Copied · paste to forge' : 'Copied · paste to apply';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2200);
  }

  function openModal(t) {
    activeTheme = t;
    modalTitle.textContent = t.name;

    // Meta row
    while (modalMeta.firstChild) modalMeta.removeChild(modalMeta.firstChild);
    const metaPairs = [
      ['tier', t.tier],
      ['track', t.track || '—'],
      ['category', t.category || '—'],
      ['density', t.density || '—'],
    ];
    for (const [k, v] of metaPairs) {
      const s = document.createElement('span');
      const b = document.createElement('b');
      b.textContent = k;
      s.appendChild(b);
      s.appendChild(document.createTextNode(' ' + v));
      modalMeta.appendChild(s);
    }
    if (t.palette?.length) {
      const span = document.createElement('span');
      const b = document.createElement('b');
      b.textContent = 'palette';
      span.appendChild(b);
      span.appendChild(document.createTextNode(' '));
      for (const hex of t.palette) {
        const code = document.createElement('code');
        code.style.color = hex;
        code.textContent = hex;
        span.appendChild(code);
        span.appendChild(document.createTextNode(' '));
      }
      modalMeta.appendChild(span);
    }

    // Slides
    while (modalSlides.firstChild) modalSlides.removeChild(modalSlides.firstChild);
    if (t.slides?.length) {
      for (const s of t.slides) {
        modalSlides.appendChild(el('img', { loading: 'lazy', src: s, alt: '' }));
      }
    } else {
      modalSlides.appendChild(buildOnDemandNote(t));
    }

    if (t.htmlPath) { openHtml.href = t.htmlPath; openHtml.style.display = ''; }
    else { openHtml.style.display = 'none'; }

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function buildOnDemandNote(t) {
    const wrap = document.createElement('div');
    wrap.style.gridColumn = '1 / -1';
    wrap.style.padding = '3rem 1rem';
    wrap.style.textAlign = 'center';
    wrap.style.color = 'var(--fg-faint)';
    wrap.style.fontFamily = 'var(--font-mono)';

    const p1 = document.createElement('p');
    p1.textContent = 'No rendered slides yet — this theme is on-demand.';
    const p2 = document.createElement('p');
    p2.style.marginTop = '1.5rem';
    p2.textContent = 'In Claude Code, run:';
    const p3 = document.createElement('p');
    p3.style.marginTop = '0.5rem';
    const code = document.createElement('code');
    code.style.color = 'var(--accent)';
    code.style.fontSize = '1.1em';
    code.textContent = `/slide-theme ${t.slug}`;
    p3.appendChild(code);
    const p4 = document.createElement('p');
    p4.style.marginTop = '1.5rem';
    p4.appendChild(document.createTextNode('Then rebuild the gallery: '));
    const c2 = document.createElement('code');
    c2.textContent = 'npm run gallery:build';
    p4.appendChild(c2);

    wrap.append(p1, p2, p3, p4);
    return wrap;
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeTheme = null;
  }

  function forgeInstructions(t) {
    activeTheme = t;
    modalTitle.textContent = `Forge ${t.name}`;
    while (modalMeta.firstChild) modalMeta.removeChild(modalMeta.firstChild);
    while (modalSlides.firstChild) modalSlides.removeChild(modalSlides.firstChild);

    const wrap = document.createElement('div');
    wrap.style.gridColumn = '1 / -1';
    wrap.style.padding = '2rem 1rem';
    wrap.style.textAlign = 'center';

    const l1 = document.createElement('p');
    l1.style.color = 'var(--fg-dim)';
    l1.textContent = 'In Claude Code (or your terminal), run:';
    const l2 = document.createElement('p');
    l2.style.marginTop = '1rem';
    l2.style.fontSize = '1.2em';
    const code = document.createElement('code');
    code.style.color = 'var(--accent)';
    code.style.fontFamily = 'var(--font-mono)';
    code.textContent = `/slide-theme ${t.slug}`;
    l2.appendChild(code);
    const l3 = document.createElement('p');
    l3.style.color = 'var(--fg-faint)';
    l3.style.marginTop = '1.5rem';
    l3.style.fontSize = '.85em';
    l3.textContent = 'The theme-forger agent will generate the CSS and DESIGN.md (~30 seconds), write them to assets/design-systems/generated/, and the theme becomes available in this gallery on next rebuild.';

    wrap.append(l1, l2, l3);
    modalSlides.appendChild(wrap);

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  render();
})();
