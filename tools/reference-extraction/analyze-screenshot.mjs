#!/usr/bin/env node
/**
 * analyze-screenshot.mjs - turns a full-page PNG into measured evidence.
 *
 * When the reference site cannot be loaded, a screenshot is not a consolation
 * prize. Every pixel is a measurement. This reads one and reports:
 *
 *   1. PALETTE      exact hex values ranked by pixel count, plus near-duplicate
 *                   grouping, so a 3-color system does not look like 40 colors
 *   2. BANDS        horizontal bands down the page and each one's background,
 *                   which is the section rhythm: where it goes dark, where it
 *                   goes light, and how tall each section actually is
 *   3. CONTENT BOX  per band, the x-range that holds non-background pixels:
 *                   content max-width and the gutters around it
 *   4. ACCENT MAP   for the most saturated frequent color, where it appears down
 *                   the page and where it never does. That absence is usually the
 *                   most important rule in the whole system
 *
 * Dependency-free: node:fs and node:zlib only. Decodes 8-bit non-interlaced PNG
 * (color types 0, 2, 4, 6), which is what browser screenshots are.
 *
 *   node tools/reference-extraction/analyze-screenshot.mjs shot.png [--accent "#e30613"] [--json out.json]
 */
import fs from 'node:fs';
import zlib from 'node:zlib';

// ── PNG decode ──────────────────────────────────────────────────────────────
function decodePng(buf) {
  const SIG = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (buf[i] !== SIG[i]) throw new Error('not a PNG');
  let p = 8, ihdr = null, idat = [], plte = null, trns = null;
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') ihdr = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), bitDepth: data[8], colorType: data[9], interlace: data[12] };
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') plte = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (!ihdr) throw new Error('no IHDR');
  if (ihdr.interlace) throw new Error('interlaced PNG not supported - re-save without Adam7');
  if (ihdr.bitDepth !== 8) throw new Error(`bit depth ${ihdr.bitDepth} not supported - export 8-bit PNG`);
  const CH = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (!CH) throw new Error(`color type ${ihdr.colorType} not supported`);

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const { width: W, height: H } = ihdr, bpp = CH, stride = W * bpp;
  const out = Buffer.alloc(H * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0, off = 0; y < H; y++) {
    const filter = raw[off++];
    const line = raw.subarray(off, off + stride); off += stride;
    const cur = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0, x = line[i];
      let v;
      switch (filter) {
        case 0: v = x; break;
        case 1: v = x + a; break;
        case 2: v = x + b; break;
        case 3: v = x + ((a + b) >> 1); break;
        case 4: { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
                  v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break; }
        default: throw new Error(`bad filter ${filter} on row ${y}`);
      }
      cur[i] = v & 0xff;
    }
    cur.copy(out, y * stride); prev = cur;
  }

  // normalize to RGB triplets
  const rgb = new Uint8Array(W * H * 3);
  for (let i = 0, n = W * H; i < n; i++) {
    const s = i * CH, d = i * 3;
    if (ihdr.colorType === 0 || ihdr.colorType === 4) { rgb[d] = rgb[d + 1] = rgb[d + 2] = out[s]; }
    else if (ihdr.colorType === 3) { const q = out[s] * 3; rgb[d] = plte[q]; rgb[d + 1] = plte[q + 1]; rgb[d + 2] = plte[q + 2]; }
    else { rgb[d] = out[s]; rgb[d + 1] = out[s + 1]; rgb[d + 2] = out[s + 2]; }
  }
  return { width: W, height: H, rgb };
}

// ── color helpers ───────────────────────────────────────────────────────────
const hex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
const parseHex = h => { const s = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)); };
const sat = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; };
const lum = (r, g, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = (a, b) => { const [l1, l2] = [lum(...a), lum(...b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

// ── analysis ────────────────────────────────────────────────────────────────
const file = process.argv[2];
if (!file) { console.error('usage: analyze-screenshot.mjs <shot.png> [--accent "#rrggbb"] [--json out.json]'); process.exit(1); }
const argOf = n => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : null; };

const { width: W, height: H, rgb } = decodePng(fs.readFileSync(file));
const at = (x, y) => { const i = (y * W + x) * 3; return [rgb[i], rgb[i + 1], rgb[i + 2]]; };

// 1. palette
const exact = new Map();
const STEP = Math.max(1, Math.round(Math.sqrt((W * H) / 400000))); // cap the sample at ~400k px
for (let y = 0; y < H; y += STEP) for (let x = 0; x < W; x += STEP) {
  const k = (rgb[(y * W + x) * 3] << 16) | (rgb[(y * W + x) * 3 + 1] << 8) | rgb[(y * W + x) * 3 + 2];
  exact.set(k, (exact.get(k) || 0) + 1);
}
const sampled = [...exact.values()].reduce((a, b) => a + b, 0);
const ranked = [...exact.entries()].sort((a, b) => b[1] - a[1])
  .map(([k, count]) => ({ rgb: [(k >> 16) & 255, (k >> 8) & 255, k & 255], count }));

// group near-duplicates (antialiasing halos) into their dominant neighbour
const groups = [];
for (const c of ranked) {
  const near = groups.find(g => dist(g.rgb, c.rgb) <= 12);
  if (near) { near.count += c.count; near.members++; } else groups.push({ ...c, members: 1 });
  if (groups.length > 400) break;
}
const palette = groups.slice(0, 18).map(g => ({
  hex: hex(...g.rgb), rgb: g.rgb, share: +(100 * g.count / sampled).toFixed(2),
  saturation: +sat(...g.rgb).toFixed(2), luminance: +lum(...g.rgb).toFixed(3), mergedShades: g.members,
}));

// 2. bands: modal color of each row, then merge runs
const rowMode = [];
for (let y = 0; y < H; y++) {
  const m = new Map();
  for (let x = 0; x < W; x += Math.max(1, Math.floor(W / 160))) {
    const k = (rgb[(y * W + x) * 3] << 16) | (rgb[(y * W + x) * 3 + 1] << 8) | rgb[(y * W + x) * 3 + 2];
    m.set(k, (m.get(k) || 0) + 1);
  }
  let best = 0, bk = 0; for (const [k, v] of m) if (v > best) { best = v; bk = k; }
  rowMode.push([(bk >> 16) & 255, (bk >> 8) & 255, bk & 255]);
}
const bands = [];
for (let y = 0; y < H; y++) {
  const last = bands[bands.length - 1];
  if (last && dist(last.rgbRaw, rowMode[y]) <= 10) { last.end = y; }
  else bands.push({ start: y, end: y, rgbRaw: rowMode[y] });
}
const MIN_BAND = Math.max(24, Math.round(H * 0.004));
const merged = bands.filter(b => b.end - b.start >= MIN_BAND).map(b => {
  // content box: columns that differ from the band background
  let minX = W, maxX = 0;
  const sy = Math.min(b.end, b.start + Math.floor((b.end - b.start) / 2));
  for (let y = b.start; y <= b.end; y += Math.max(1, Math.floor((b.end - b.start) / 40) || 1))
    for (let x = 0; x < W; x++) if (dist(at(x, y), b.rgbRaw) > 24) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  const hasContent = maxX >= minX;
  return {
    y: [b.start, b.end], height: b.end - b.start + 1, background: hex(...b.rgbRaw),
    luminance: +lum(...b.rgbRaw).toFixed(3), tone: lum(...b.rgbRaw) < 0.18 ? 'dark' : lum(...b.rgbRaw) > 0.7 ? 'light' : 'mid',
    contentBox: hasContent ? { left: minX, right: maxX, width: maxX - minX + 1, gutter: minX } : null,
    _sy: sy,
  };
});

// 3. accent map
const accentHex = argOf('accent');
const accent = accentHex ? parseHex(accentHex)
  : (palette.find(p => p.saturation > 0.45 && p.share < 25 && p.share > 0.02)?.rgb || null);
let accentReport = null;
if (accent) {
  const rows = new Array(H).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x += 2) if (dist(at(x, y), accent) <= 40) rows[y]++;
  const total = rows.reduce((a, b) => a + b, 0);
  accentReport = {
    hex: hex(...accent), source: accentHex ? 'declared' : 'auto-detected (most saturated frequent color)',
    totalPixelShare: +(100 * total / (W * H / 2)).toFixed(3),
    perBand: merged.map(b => {
      const px = rows.slice(b.y[0], b.y[1] + 1).reduce((a, c) => a + c, 0);
      const area = (b.height * W) / 2;
      return { y: b.y, background: b.background, accentShare: +(100 * px / area).toFixed(3) };
    }),
  };
}

// 4. contrast of the frequent text-ish colors against the two dominant backgrounds
const backgrounds = [...new Set(merged.map(b => b.background))].slice(0, 4);
const pairs = [];
for (const bgHex of backgrounds) {
  const bg = parseHex(bgHex);
  for (const p of palette.slice(0, 8)) {
    if (dist(p.rgb, bg) < 30) continue;
    pairs.push({ fg: p.hex, bg: bgHex, ratio: +contrast(p.rgb, bg).toFixed(2),
      passesBodyAA: contrast(p.rgb, bg) >= 4.5, passesLargeAA: contrast(p.rgb, bg) >= 3 });
  }
}

const report = {
  file, image: { width: W, height: H, sampleStep: STEP, pixelsSampled: sampled },
  palette, bands: merged.map(({ _sy, ...b }) => b), accent: accentReport,
  contrastPairs: pairs.sort((a, b) => b.ratio - a.ratio).slice(0, 24),
  note: 'Pixel-measured from a screenshot. Values are what rendered, including antialiasing and image content. Marks derived from this file are [E-px]: measured, but not read from the source CSS.',
};

const jsonOut = argOf('json');
if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2)); console.log(`wrote ${jsonOut}`); }

const pct = n => `${String(n).padStart(6)}%`;
console.log(`\n${file}  ${W}x${H}  (sampled every ${STEP}px)\n`);
console.log('PALETTE');
palette.forEach(p => console.log(`  ${p.hex}  ${pct(p.share)}  sat ${p.saturation.toFixed(2)}  lum ${p.luminance.toFixed(3)}  (+${p.mergedShades - 1} shades)`));
console.log('\nBANDS (section rhythm)');
report.bands.forEach(b => console.log(`  y ${String(b.y[0]).padStart(5)}-${String(b.y[1]).padStart(5)}  h${String(b.height).padStart(5)}  ${b.background}  ${b.tone.padEnd(5)}  ${b.contentBox ? `content ${b.contentBox.width}px, gutter ${b.contentBox.gutter}px` : 'empty'}`));
if (accentReport) {
  console.log(`\nACCENT ${accentReport.hex} (${accentReport.source}) - ${accentReport.totalPixelShare}% of the page`);
  accentReport.perBand.forEach(b => console.log(`  y ${String(b.y[0]).padStart(5)}-${String(b.y[1]).padStart(5)}  on ${b.background}  ${String(b.accentShare).padStart(7)}%  ${b.accentShare === 0 ? '<- accent never appears here' : ''}`));
}
console.log('\nCONTRAST (top pairs)');
report.contrastPairs.slice(0, 12).forEach(p => console.log(`  ${p.fg} on ${p.bg}  ${String(p.ratio).padStart(6)}:1  body AA ${p.passesBodyAA ? 'pass' : 'FAIL'}  large AA ${p.passesLargeAA ? 'pass' : 'FAIL'}`));
console.log();
