#!/usr/bin/env node
/**
 * detect-canvas-antipatterns.mjs
 *
 * Deterministic, dependency-free preflight for measurable AI-design, a11y,
 * and mobile tells in static canvas files. Node built-ins only.
 *
 * Contract:
 * - P1 = deterministic correctness, accessibility, or named hard-bans. Exit 1.
 * - P2 = aesthetic/responsive tells that need review. Exit 0 by default.
 * - --strict exits 1 when P2 findings exist.
 */
import fs from 'node:fs';
import path from 'node:path';
import { isPathInsideRoot } from './file-snapshot.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const json = args.includes('--json');
const strict = args.includes('--strict');
const targets = args.filter((arg) => arg !== '--json' && arg !== '--strict');
const scanTargets = targets.length ? targets : ['.'];
const exts = new Set(['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.astro', '.vue', '.svelte']);

const LAYOUT_PROPS = new Set([
  'width',
  'height',
  'margin',
  'padding',
  'top',
  'left',
  'right',
  'bottom',
  'inset',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
]);

function extOf(filePath) {
  const match = filePath.match(/\.[a-z]+$/i);
  return match ? match[0].toLowerCase() : '';
}

function firstMatch(text, re) {
  const match = text.match(re);
  return match ? match[0].replace(/\s+/g, ' ').trim().slice(0, 120) : null;
}

function tooTightTracking(text) {
  const re = /letter-spacing\s*:\s*(-?\d*\.?\d+)\s*(em|rem|px)?/gi;
  let match;
  while ((match = re.exec(text))) {
    const value = Number.parseFloat(match[1]);
    const unit = (match[2] || 'em').toLowerCase();
    if ((unit === 'em' || unit === 'rem') && value < -0.04) return match[0];
    if (unit === 'px' && value <= -1) return match[0];
  }
  return null;
}

function oversizedRadius(text) {
  const re = /border-radius\s*:\s*(\d+(?:\.\d+)?)px\b/gi;
  let match;
  while ((match = re.exec(text))) {
    const value = Number.parseFloat(match[1]);
    if (value >= 24 && value < 500) return match[0];
  }
  return null;
}

function layoutTransition(text) {
  const re = /transition(?:-property)?\s*:\s*([^;}]+)/gi;
  let match;
  while ((match = re.exec(text))) {
    const value = match[1].trim();
    if (/(^|,)\s*all\b/i.test(value)) return `transition: ${value}`;
    for (const part of value.split(',')) {
      const prop = (part.trim().match(/^[a-z-]+/i) || [''])[0].toLowerCase();
      if (LAYOUT_PROPS.has(prop)) return `transition: ${value}`;
    }
  }
  return null;
}

function hasFocusRemedy(text) {
  if (/:focus-visible/i.test(text)) return true;
  return /:focus\b/i.test(text)
    && /(box-shadow|outline\s*:|border(?:-[a-z]+)?\s*:|background|\bring\b|text-decoration)/i.test(text);
}

function isNativeCard(text) {
  return /@dsCard\b/.test(text);
}

function isHtmlFragment(text) {
  return !/<!DOCTYPE\b/i.test(text) && !/<html\b/i.test(text);
}

const rules = [
  {
    id: 'missing-viewport-meta',
    severity: 'P1',
    files: ['.html'],
    message: 'HTML previews need a mobile viewport meta tag.',
    test: (text) => (!isNativeCard(text) && !isHtmlFragment(text) && !/<meta\s+name=["']viewport["'][^>]*width=device-width/i.test(text)
      ? 'no <meta name="viewport" width=device-width>'
      : null),
  },
  {
    id: 'missing-html-lang',
    severity: 'P1',
    files: ['.html'],
    message: 'HTML documents need a lang attribute for screen readers and translation.',
    test: (text) => (!isNativeCard(text) && !isHtmlFragment(text) && !/<html\b[^>]*\blang=["'][^"']+["']/i.test(text)
      ? '<html> has no lang attribute'
      : null),
  },
  {
    id: 'missing-title',
    severity: 'P1',
    files: ['.html'],
    message: 'HTML documents need a non-empty title.',
    test: (text) => (!isNativeCard(text) && !isHtmlFragment(text) && !/<title>\s*[^<\s][^<]*<\/title>/i.test(text)
      ? 'empty or missing <title>'
      : null),
  },
  {
    id: 'image-missing-alt',
    severity: 'P1',
    files: ['.html', '.jsx', '.tsx', '.astro', '.vue', '.svelte'],
    message: 'Images need alt text, or alt="" when decorative.',
    test: (text) => firstMatch(text, /<img\b(?![^>]*\balt=)[^>]*>/i),
  },
  {
    id: 'empty-image-src',
    severity: 'P1',
    message: 'Empty image src values ship broken preview boxes.',
    test: (text) => firstMatch(text, /<img\b[^>]*\bsrc=["']\s*["'][^>]*>/i),
  },
  {
    id: 'gradient-text',
    severity: 'P1',
    message: 'Gradient text (background-clip:text + gradient) is a decorative AI tell; use solid color.',
    test: (text) => (/background-clip\s*:\s*text/i.test(text) && /gradient\(/i.test(text)
      ? 'background-clip:text + gradient'
      : null),
  },
  {
    id: 'side-accent-border',
    severity: 'P1',
    message: 'Thick colored side borders (border-left/right >= 2px) read as generated UI scaffolding.',
    test: (text) => firstMatch(text, /border-(?:left|right)\s*:\s*(?:[2-9]|\d{2,})px\b[^;]*/i),
  },
  {
    id: 'font-size-vw',
    severity: 'P1',
    message: 'Viewport-width font sizing can overflow; prefer clamp()/rem.',
    test: (text) => firstMatch(text, /font-size\s*:\s*[^;]*\bvw\b[^;]*/i),
  },
  {
    id: 'outline-none',
    severity: 'P1',
    message: 'outline:none with no visible focus alternative breaks keyboard navigation.',
    test: (text) => (/outline\s*:\s*(?:0|none)\b/i.test(text) && !hasFocusRemedy(text)
      ? 'outline:none with no :focus/:focus-visible remedy in file'
      : null),
  },
  {
    id: 'purple-gradient',
    severity: 'P2',
    message: 'Purple/violet/indigo gradients are overused AI palette defaults; confirm intent.',
    test: (text) => firstMatch(text, /(?:linear|radial|conic)-gradient\([^)]*(?:purple|violet|indigo)[^)]*\)/i)
      || firstMatch(text, /\bfrom-(?:purple|violet|indigo)-\d+[^"']*\bto-(?:purple|violet|indigo|blue|cyan|pink|fuchsia)-\d+/i),
  },
  {
    id: 'decorative-glass',
    severity: 'P2',
    message: 'Glassmorphism/backdrop-blur should be purposeful, not a default surface. Sticky chrome is usually fine.',
    test: (text) => firstMatch(text, /backdrop-filter\s*:\s*[^;]*blur[^;]*|backdrop-blur(?:-\w+)?|glassmorphism/i),
  },
  {
    id: 'oversized-radius',
    severity: 'P2',
    message: 'Large card radius (24-499px) can read as generic soft-SaaS; verify it is intentional. Full pill radii are ignored.',
    test: (text) => oversizedRadius(text),
  },
  {
    id: 'extreme-negative-tracking',
    severity: 'P2',
    message: 'Letter spacing tighter than -0.04em risks cramped display type.',
    test: (text) => tooTightTracking(text),
  },
  {
    id: 'layout-transition',
    severity: 'P2',
    message: 'Avoid transition: all or transitioning layout properties (width/height/margin/padding/inset).',
    test: (text) => layoutTransition(text),
  },
  {
    id: 'large-fixed-width',
    severity: 'P2',
    message: 'Large fixed widths are risky on mobile; prefer max-width, min(), clamp(), or grid. Check it is inside a desktop media query.',
    test: (text) => firstMatch(text, /(?:^|[\s;{>"'(])(?:min-)?width\s*:\s*(?:3[7-9]\d|[4-9]\d{2,}|\d{4,})px\b/i),
  },
  {
    id: 'body-width-100vw',
    severity: 'P2',
    message: 'width:100vw can create horizontal overflow when scrollbars are present.',
    test: (text) => firstMatch(text, /\bwidth\s*:\s*100vw\b/i),
  },
  {
    id: 'image-hover-transform',
    severity: 'P2',
    message: 'Hover-transforming images is usually decorative rather than informative.',
    test: (text) => (/img:hover\s*\{[^}]*transform\s*:/is.test(text)
      ? 'img:hover { transform }'
      : firstMatch(text, /group-hover:(?:scale|rotate|translate)-[\w.]+/i)),
  },
];

function projectRules(files) {
  const findings = [];
  const anyReducedMotion = files.some((file) => /prefers-reduced-motion/i.test(file.text));
  if (!anyReducedMotion) {
    const animated = files.find((file) => /(^|[;{}\s])(?:animation|transition)\s*:/i.test(file.text));
    if (animated) {
      findings.push({
        file: '(project)',
        id: 'motion-without-reduced-motion',
        severity: 'P2',
        message: 'The project animates but never references prefers-reduced-motion anywhere. Add one global fallback.',
        snippet: `first seen in ${animated.path}`,
      });
    }
  }
  return findings;
}

function analyze(files) {
  const findings = [];
  for (const file of files) {
    for (const rule of rules) {
      if (rule.files && !rule.files.includes(extOf(file.path))) continue;
      const hit = rule.test(file.text);
      if (hit) {
        findings.push({
          file: file.path,
          id: rule.id,
          severity: rule.severity,
          message: rule.message,
          snippet: typeof hit === 'string' ? hit : '',
        });
      }
    }
  }
  findings.push(...projectRules(files));
  return findings;
}

function walkTarget(target, files = []) {
  if (!isPathInsideRoot(root, target)) return files;
  const abs = path.resolve(root, target);
  if (!fs.existsSync(abs)) return files;
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      if (
        ['node_modules', '.git', 'dist', 'build', '.next', '_archive', 'scripts', '_ds'].includes(
          ent.name,
        )
      ) {
        continue;
      }
      walkTarget(path.join(target, ent.name), files);
    }
    return files;
  }
  if (exts.has(extOf(abs))) files.push(path.relative(root, abs));
  return files;
}

const paths = scanTargets.flatMap((target) => walkTarget(target));
const corpus = [];
for (const filePath of paths) {
  try {
    corpus.push({ path: filePath, text: fs.readFileSync(path.join(root, filePath), 'utf8') });
  } catch {
    // Skip unreadable files.
  }
}

const findings = analyze(corpus);
const p1 = findings.filter((finding) => finding.severity === 'P1');
const p2 = findings.filter((finding) => finding.severity === 'P2');
const result = { scannedFiles: corpus.length, findingCount: findings.length, p1: p1.length, p2: p2.length, findings };

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!findings.length) {
  process.stdout.write(`No canvas anti-patterns found in ${corpus.length} files.\n`);
} else {
  process.stdout.write(`Scanned ${corpus.length} files - ${p1.length} P1 (fail), ${p2.length} P2 (review):\n`);
  for (const finding of findings) {
    process.stdout.write(`- [${finding.severity}] ${finding.file}: ${finding.id} - ${finding.message}${finding.snippet ? `\n      -> ${finding.snippet}` : ''}\n`);
  }
}

process.exit(p1.length > 0 || (strict && p2.length > 0) ? 1 : 0);
