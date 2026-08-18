#!/usr/bin/env node
/**
 * extract-reference.mjs - automated version of console-dump.js
 *
 * Same capture logic (it literally evaluates console-dump.js in the page), plus
 * screenshots at desktop and mobile, scroll-position captures, and the raw HTML.
 * Use this wherever the network can actually reach the reference site.
 *
 *   npm i -D playwright        # or: npx playwright@1.56 install chromium
 *   node tools/reference-extraction/extract-reference.mjs \
 *        --url "https://exemplo.com/pagina" \
 *        --out research/exemplo/ \
 *        --label home
 *
 * Options:
 *   --url <url>        page to capture (required)
 *   --out <dir>        output directory (default: research/<hostname>)
 *   --label <name>     file prefix (default: page)
 *   --browser <path>   chromium executable, if not resolved by playwright
 *   --proxy <server>   http proxy, e.g. http://127.0.0.1:8080
 *
 * Output per label: <label>-<viewport>.json, <label>.html, and PNGs
 * (full page + hero + three scroll depths).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i > -1 ? argv[i + 1] : d; };
const url = arg('url');
if (!url) { console.error('missing --url'); process.exit(1); }
const label = arg('label', 'page');
const out = arg('out', path.join('research', new URL(url).hostname));
const here = path.dirname(fileURLToPath(import.meta.url));
const dump = fs.readFileSync(path.join(here, 'console-dump.js'), 'utf8');

const { chromium } = await import('playwright');
fs.mkdirSync(out, { recursive: true });

const proxy = arg('proxy');
const browser = await chromium.launch({
  ...(arg('browser') ? { executablePath: arg('browser') } : {}),
  ...(proxy ? { proxy: { server: proxy } } : {}),
});

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({
    viewport, locale: 'pt-BR',
    deviceScaleFactor: name === 'mobile' ? 2 : 1,
    isMobile: name === 'mobile', hasTouch: name === 'mobile',
  });
  const page = await ctx.newPage();
  const fontFiles = new Set();
  page.on('response', r => {
    const u = r.url();
    if (/\.(woff2?|ttf|otf)(\?|$)/i.test(u)) fontFiles.add(u.split('?')[0]);
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);

  // play every reveal animation before measuring, then return to the top
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 350));
    }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 800));
  });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(dump);
  data.meta.webfontFiles = [...fontFiles];
  data.meta.captureMode = `playwright/${name}`;
  fs.writeFileSync(path.join(out, `${label}-${name}.json`), JSON.stringify(data, null, 2));

  await page.screenshot({ path: path.join(out, `${label}-${name}-full.png`), fullPage: true });
  await page.screenshot({ path: path.join(out, `${label}-${name}-hero.png`) });

  if (name === 'desktop') {
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (const [i, frac] of [0.25, 0.5, 0.75].entries()) {
      await page.evaluate(y => scrollTo(0, y), Math.round(h * frac));
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(out, `${label}-desktop-scroll${i + 1}.png`) });
    }
    fs.writeFileSync(path.join(out, `${label}.html`), await page.content());
  }

  console.log(`${label}/${name}: ${data.meta.elementsCounted} elements · ` +
    `${data.type.size.length} sizes · ${data.motion.keyframes.length} keyframes · ` +
    `${fontFiles.size} webfonts · ${data.meta.blockedStylesheets} cross-origin sheets blocked`);
  await ctx.close();
}
await browser.close();
console.log(`\nwrote ${out}/`);
