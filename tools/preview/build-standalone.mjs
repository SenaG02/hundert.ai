#!/usr/bin/env node
/**
 * build-standalone.mjs — flattens a Hundert AI .dc.html into one self-contained
 * HTML file that opens in any browser, outside Claude Design Web.
 *
 * .dc.html files use runtime tags that only Claude Design Web understands:
 * <x-dc>, <helmet>, and a page-relative ./support.js. There is no server here
 * to resolve <link rel="stylesheet" href="./tokens.css">, so this script
 * inlines tokens.css and components.css verbatim, strips the DC-specific
 * wrapper, and keeps everything else byte-for-byte: no redesign, no new
 * values — same rule as every other script in this harness.
 *
 * Output is gitignored (see .gitignore): it is a generated duplicate of
 * tokens.css + components.css + the source .dc.html, and goes stale the
 * moment any of those change. Regenerate on demand; never hand-edit the
 * output; never commit it.
 *
 *   node tools/preview/build-standalone.mjs landing.dc.html
 *   node tools/preview/build-standalone.mjs design-system.dc.html --out .preview/design-system.html
 */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const src = argv.find(a => !a.startsWith('--'));
if (!src) {
  console.error('usage: build-standalone.mjs <file.dc.html> [--out <path>] [--title "..."]');
  process.exit(1);
}
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i > -1 ? argv[i + 1] : d; };

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const tokens = read('tokens.css');
const components = read('components.css');
const dc = read(src);

function between(s, open, close, label) {
  const i = s.indexOf(open);
  const j = s.indexOf(close, i);
  if (i === -1 || j === -1) throw new Error(`could not find ${label} in ${src}`);
  return s.slice(i + open.length, j);
}

const helmet = between(dc, '<helmet>', '</helmet>', '<helmet>');
const pageStyle = between(helmet, '<style>', '</style>', 'page <style>');

const bodyStart = dc.indexOf('<div class="hds">');
const bodyEndMarker = '</div>\n\n<script>';
const bodyEnd = dc.indexOf(bodyEndMarker);
if (bodyStart === -1 || bodyEnd === -1) throw new Error(`could not find body markers in ${src}`);
const body = dc.slice(bodyStart, bodyEnd + '</div>'.length);

const scriptStart = dc.indexOf('<script>\n(function () {');
const scriptEndMarker = '</script>\n</x-dc>';
const scriptEnd = dc.indexOf(scriptEndMarker);
if (scriptStart === -1 || scriptEnd === -1) throw new Error(`could not find script markers in ${src}`);
const script = dc.slice(scriptStart, scriptEnd + '</script>'.length);

const title = arg('title', 'Hundert AI');
const html = `<!doctype html>
<html lang="pt-BR" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* ══ tokens.css — inlined verbatim, do not hand-edit here ══ */
${tokens}

/* ══ components.css — inlined verbatim, do not hand-edit here ══ */
${components}

/* ══ page-specific rules from ${src} ══ */
html{background:var(--bg-base);}
body{margin:0;background:var(--bg-base);}
${pageStyle}
</style>
</head>
<body>

${body}

${script}
</body>
</html>
`;

const out = path.join(root, arg('out', path.join('.preview', path.basename(src, '.dc.html') + '.html')));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${path.relative(root, out)} (${html.length} bytes)`);
