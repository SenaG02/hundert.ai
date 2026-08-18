/* ─────────────────────────────────────────────────────────────────────────────
   REFERENCE EVIDENCE DUMP v2 - paste into DevTools Console on the reference page
   ─────────────────────────────────────────────────────────────────────────────
   Captures what a design system is actually made of, with usage frequency:
     colors · typography (family/size/weight/line-height/tracking) · radius
     shadow · spacing · gap · transitions · @keyframes · @font-face
     CSS custom properties · media queries · role specimens · section rhythm

   Frequency is the signal. It separates a structural token (used 200x across
   sections) from one-off noise (used once in a single badge).

   HOW TO RUN
   1. Open the page. Accept cookie banners. Scroll to the bottom, then back to
      the top - reveal animations only register after they have played.
   2. F12 -> Console. If Chrome asks, type: allow pasting
   3. Paste this whole file, Enter. The JSON is copied to your clipboard
      automatically (and printed).
   4. Paste it into research/<slug>/dump-desktop.json
   5. Resize the window to ~390px wide (or toggle device emulation), reload,
      re-run, save as dump-mobile.json. Mobile is where the scale really shows.
   6. Repeat on 2-3 more pages of the same site (home, pricing, docs/app).
      A value that survives four pages is structural. A value that appears on
      one page is a decoration.
   ───────────────────────────────────────────────────────────────────────────── */
(() => {
  const VISIBLE_ONLY = true; // hidden mobile/desktop duplicates would double-count
  const bump = (o, v) => {
    if (!v) return;
    const s = String(v);
    if (s === 'none' || s === 'normal' || s === 'auto' || s === '0px' ||
        s === 'rgba(0, 0, 0, 0)' || s === 'transparent') return;
    o[s] = (o[s] || 0) + 1;
  };
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([value, count]) => ({ value: value.slice(0, 220), count }));

  const c = {}, bgc = {}, bgi = {}, bdc = {}, bdw = {}, fam = {}, size = {}, wgt = {},
        lh = {}, ls = {}, tt = {}, rad = {}, shd = {}, pad = {}, gap = {}, trs = {}, ani = {};

  const all = [...document.querySelectorAll('*')];
  let counted = 0;
  all.forEach(e => {
    const g = getComputedStyle(e);
    if (VISIBLE_ONLY) {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || g.visibility === 'hidden' || g.display === 'none' || g.opacity === '0') return;
    }
    counted++;
    const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    bump(bgc, g.backgroundColor); bump(bdc, g.borderColor); bump(bdw, g.borderTopWidth);
    if (g.backgroundImage && g.backgroundImage !== 'none') bump(bgi, g.backgroundImage);
    if (hasText) { // typography only counts where type actually renders
      bump(c, g.color); bump(fam, g.fontFamily); bump(size, g.fontSize);
      bump(wgt, g.fontWeight); bump(lh, g.lineHeight); bump(ls, g.letterSpacing);
      bump(tt, g.textTransform);
    }
    bump(rad, g.borderRadius); bump(shd, g.boxShadow); bump(pad, g.padding); bump(gap, g.gap);
    if (g.transitionDuration && g.transitionDuration !== '0s')
      bump(trs, `${g.transitionProperty} | ${g.transitionDuration} | ${g.transitionTimingFunction} | delay ${g.transitionDelay}`);
    if (g.animationName && g.animationName !== 'none')
      bump(ani, `${g.animationName} | ${g.animationDuration} | ${g.animationTimingFunction} | ${g.animationIterationCount} | delay ${g.animationDelay}`);
  });

  // ── stylesheet-level truth: keyframes, font-face, custom props, breakpoints ──
  const keyframes = [], fontFaces = [], media = new Set(), vars = {};
  const walk = (rules, depth = 0) => {
    if (!rules || depth > 6) return;
    for (const rule of rules) {
      try {
        const kind = rule.constructor && rule.constructor.name;
        if (kind === 'CSSKeyframesRule') keyframes.push(rule.cssText.replace(/\s+/g, ' ').slice(0, 1200));
        else if (kind === 'CSSFontFaceRule') fontFaces.push(rule.cssText.replace(/\s+/g, ' ').slice(0, 500));
        else if (kind === 'CSSMediaRule') { media.add(rule.conditionText || rule.media.mediaText); walk(rule.cssRules, depth + 1); }
        else if (rule.cssRules) walk(rule.cssRules, depth + 1);
        if (rule.style) for (const p of rule.style) {
          if (p.startsWith('--')) bump(vars, `${p}: ${rule.style.getPropertyValue(p).trim()}`);
        }
      } catch (_) { /* cross-origin sheet */ }
    }
  };
  let blockedSheets = 0;
  for (const ss of document.styleSheets) { try { walk(ss.cssRules); } catch (_) { blockedSheets++; } }

  // ── role specimens: the literal recipe of each component ──
  const KEYS = ['color','backgroundColor','backgroundImage','fontFamily','fontSize','fontWeight',
    'lineHeight','letterSpacing','textTransform','textAlign','borderRadius','borderWidth','borderColor',
    'borderStyle','boxShadow','padding','margin','gap','display','flexDirection','alignItems',
    'justifyContent','maxWidth','minHeight','opacity','transform','backdropFilter','textDecorationLine',
    'transitionProperty','transitionDuration','transitionTimingFunction','animationName','animationDuration'];
  const desc = e => {
    const g = getComputedStyle(e), r = e.getBoundingClientRect(), css = {};
    KEYS.forEach(k => {
      const v = g[k];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') css[k] = String(v).slice(0, 220);
    });
    return {
      tag: e.tagName.toLowerCase(),
      cls: (typeof e.className === 'string' ? e.className : '').slice(0, 140),
      text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
      box: { w: Math.round(r.width), h: Math.round(r.height) },
      css,
    };
  };
  const many = (sel, n) => { try { return [...document.querySelectorAll(sel)]
    .filter(e => e.getBoundingClientRect().width > 0).slice(0, n).map(desc); } catch (_) { return []; } };

  const specimens = {
    h1: many('h1', 2), h2: many('h2', 3), h3: many('h3', 3), h4: many('h4,h5,h6', 3),
    body: many('p', 4), eyebrow: many('[class*="eyebrow"],[class*="tag"],[class*="badge"],[class*="label"]', 3),
    buttonPrimary: many('button,[class*="btn"],[class*="button"],a[class*="cta"]', 6),
    link: many('main a, section a', 4),
    field: many('input,textarea,select', 4),
    fieldLabel: many('label', 3),
    card: many('[class*="card"],[class*="Card"],li[class*="item"]', 5),
    section: many('section,main > div', 6),
    nav: many('header,nav', 2), footer: many('footer', 1),
  };

  const rhythm = [...document.querySelectorAll('section, main > div, body > div > div')].slice(0, 30).map(e => {
    const g = getComputedStyle(e), r = e.getBoundingClientRect();
    return { cls: (typeof e.className === 'string' ? e.className : '').slice(0, 80),
      pt: g.paddingTop, pb: g.paddingBottom, h: Math.round(r.height), w: Math.round(r.width),
      bg: g.backgroundColor, bgImage: g.backgroundImage.slice(0, 140) };
  });

  const media_ = [...media];
  const out = {
    meta: { url: location.href, title: document.title, lang: document.documentElement.lang,
      viewport: { w: innerWidth, h: innerHeight }, scrollHeight: document.body.scrollHeight,
      capturedAt: new Date().toISOString(), elementsSeen: all.length, elementsCounted: counted,
      blockedStylesheets: blockedSheets },
    color: { text: top(c, 18), background: top(bgc, 18), border: top(bdc, 10),
      borderWidth: top(bdw, 6), backgroundImage: top(bgi, 10) },
    type: { family: top(fam, 8), size: top(size, 20), weight: top(wgt, 10),
      lineHeight: top(lh, 14), letterSpacing: top(ls, 10), transform: top(tt, 6) },
    space: { padding: top(pad, 22), gap: top(gap, 16) },
    shape: { radius: top(rad, 12), shadow: top(shd, 10) },
    motion: { transition: top(trs, 16), animation: top(ani, 16),
      keyframes: keyframes.slice(0, 30), prefersReducedMotionHandled: media_.some(m => /reduced-motion/.test(m)) },
    fontFaces: fontFaces.slice(0, 30),
    cssVariables: top(vars, 80),
    breakpoints: media_.slice(0, 40),
    specimens, rhythm,
  };

  const json = JSON.stringify(out, null, 2);
  try { copy(json); console.log('%c✓ dump copiado para a área de transferência', 'color:#0a0;font-weight:700'); } catch (_) {}
  console.log(json);
  console.log(`%cresumo: ${counted} elementos visíveis · ${out.color.text.length} cores de texto · ${out.type.size.length} tamanhos · ${out.motion.keyframes.length} keyframes · ${blockedSheets} folhas cross-origin bloqueadas`, 'color:#888');
  return out;
})();
