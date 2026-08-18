#!/usr/bin/env node
/**
 * Dependency-free preflight for generated-text tells in active documentation,
 * UI copy, and static content.
 *
 * Contract:
 * - P1 = hard voice/style bans. Exit 1.
 * - P2 = review notes. Exit 0 by default.
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
const scanTargets = targets.length ? targets : ['README.md', 'README.pt-BR.md', 'CLAUDE.md', 'docs', 'skills', 'templates', 'examples'];
const exts = new Set(['.md', '.html', '.txt']);

const bannedChars = [
  [0x2014, 'em dash'],
  [0x2013, 'en dash'],
  [0x2192, 'right arrow'],
  [0x2026, 'ellipsis'],
  [0x201c, 'left double quote'],
  [0x201d, 'right double quote'],
  [0x2018, 'left single quote'],
  [0x2019, 'right single quote'],
];

const escapedGeneratedLabels = [
  ['AI', 'slo' + 'p'].join(' '),
  ['anti', 'slo' + 'p'].join('-'),
  ['AI', 'looking'].join('-'),
  ['generic', 'AI'].join(' '),
].map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

const p1Patterns = [
  ['vague-generated-label', new RegExp(`\\b(?:${escapedGeneratedLabels.join('|')})\\b`, 'i')],
  ['acknowledgment-opener', /^\s*(?:certainly|sure|absolutely|claro|com certeza)[,!.\s]/im],
  ['fake-finality', /\b(?:production-ready by construction|guaranteed? results?|WCAG compliant by prompt|60fps guarantee)\b/i],
];

const p2Patterns = [
  ['advance-organizer', /\b(?:in this section|in this article|we will explore|we will cover|let'?s explore|nesta secao|nesta aula|vamos explorar|vamos ver|veremos)\b/i],
  ['recap-reflex', /\b(?:in conclusion|in summary|to summarize|to recap|em conclusao|em resumo|recapitulando|para resumir)\b/i],
  ['definition-template', /\b\w+\s+(?:is|e)\s+(?:a|an|um|uma)\s+(?:concept|term|idea|approach|method|framework|conceito|termo|ideia|abordagem|metodo|pratica)\s+(?:that|which|que)\b/i],
  ['not-x-but-y', /\b(?:not (?:just |only )?.{1,60}but|nao (?:apenas |so )?.{1,60}mas)\b/i],
  ['unlock-language', /\b(?:unlock|unleash|elevate|game-changer|revolutionary|transformative|desbloqueia|revolucionario|transformador)\b/i],
  ['generic-quality-stack', /\b(?:clear, concise, and|robust, scalable, and|powerful, flexible, and|claro, conciso e|robusto, escalavel e)\b/i],
];

function extOf(filePath) {
  const match = filePath.match(/\.[a-z]+$/i);
  return match ? match[0].toLowerCase() : '';
}

function walkTarget(target, files = []) {
  if (!isPathInsideRoot(root, target)) return files;
  const abs = path.resolve(root, target);
  if (!fs.existsSync(abs)) return files;
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      if (['.git', 'node_modules', 'dist', 'build', '.next', 'archive'].includes(ent.name)) continue;
      walkTarget(path.join(target, ent.name), files);
    }
    return files;
  }
  if (exts.has(extOf(abs))) files.push(path.relative(root, abs));
  return files;
}

function lineForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function snippet(text, index) {
  return text.slice(Math.max(0, index - 50), index + 90).replace(/\s+/g, ' ').trim();
}

function triadicListHits(text) {
  const hits = [];
  const re = /\b[\p{L}][\p{L}-]+,\s+[\p{L}][\p{L}-]+,?\s+(?:and|or|e|ou)\s+[\p{L}][\p{L}-]+\b/giu;
  let match;
  while ((match = re.exec(text))) hits.push(match);
  return hits;
}

function firstSentenceShapeFindings(text) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length < 6) return [];
  const starts = paragraphs
    .map((paragraph) => (paragraph.match(/[A-Za-zÀ-ÿ0-9][^.!?\n]{10,}[.!?]/) || [''])[0].trim())
    .filter(Boolean)
    .map((sentence) => sentence
      .toLowerCase()
      .replace(/`[^`]+`/g, 'code')
      .replace(/\[[^\]]+\]\([^)]+\)/g, 'link')
      .split(/\s+/)
      .slice(0, 3)
      .map((word) => {
        if (/^(the|a|an|o|a|os|as|um|uma)$/.test(word)) return 'article';
        if (/^(this|that|these|those|este|esta|esse|essa|isto|isso)$/.test(word)) return 'pointer';
        if (/^(we|you|i|they|ele|ela|nos|voce|voces)$/.test(word)) return 'pronoun';
        return 'word';
      })
      .join('-'));
  const counts = new Map();
  for (const shape of starts) counts.set(shape, (counts.get(shape) || 0) + 1);
  const [shape, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];
  return count >= Math.ceil(starts.length * 0.7)
    ? [{ id: 'paragraph-opening-uniformity', shape, count, total: starts.length }]
    : [];
}

function analyzeFile(file) {
  const abs = path.join(root, file);
  const text = fs.readFileSync(abs, 'utf8');
  const findings = [];

  for (const [codePoint, label] of bannedChars) {
    const char = String.fromCodePoint(codePoint);
    let index = text.indexOf(char);
    while (index !== -1) {
      findings.push({
        file,
        line: lineForIndex(text, index),
        id: `banned-${label.replace(/\s+/g, '-')}`,
        severity: 'P1',
        message: `Replace ${label} with plain ASCII punctuation.`,
        snippet: snippet(text, index),
      });
      index = text.indexOf(char, index + char.length);
    }
  }

  for (const [id, pattern] of p1Patterns) {
    const match = text.match(pattern);
    if (match) {
      findings.push({
        file,
        line: lineForIndex(text, match.index || 0),
        id,
        severity: 'P1',
        message: 'Hard-banned generated-text marker.',
        snippet: match[0],
      });
    }
  }

  for (const [id, pattern] of p2Patterns) {
    const match = text.match(pattern);
    if (match) {
      findings.push({
        file,
        line: lineForIndex(text, match.index || 0),
        id,
        severity: 'P2',
        message: 'Review this wording. It may be a generic generated-text pattern.',
        snippet: match[0],
      });
    }
  }

  const triads = triadicListHits(text);
  if (triads.length >= Math.max(3, Math.ceil(text.split(/\s+/).length / 250))) {
    findings.push({
      file,
      line: lineForIndex(text, triads[0].index || 0),
      id: 'triadic-list-density',
      severity: 'P2',
      message: 'Many three-part lists can flatten voice. Vary sentence and list shape.',
      snippet: triads[0][0],
    });
  }

  for (const hit of firstSentenceShapeFindings(text)) {
    findings.push({
      file,
      line: 1,
      id: hit.id,
      severity: 'P2',
      message: `Paragraph openings repeat one shape too often (${hit.shape}: ${hit.count}/${hit.total}).`,
      snippet: '',
    });
  }

  return findings;
}

const files = [...new Set(scanTargets.flatMap((target) => walkTarget(target)))];
const findings = files.flatMap(analyzeFile);
const failed = findings.filter((finding) => finding.severity === 'P1' || (strict && finding.severity === 'P2'));

if (json) {
  process.stdout.write(`${JSON.stringify({ findings }, null, 2)}\n`);
} else if (!findings.length) {
  process.stdout.write(`No text anti-patterns found in ${files.length} files.\n`);
} else {
  for (const finding of findings) {
    process.stdout.write(
      `${finding.severity} ${finding.file}:${finding.line} ${finding.id}\n` +
      `  ${finding.message}${finding.snippet ? `\n  ${finding.snippet}` : ''}\n`
    );
  }
}

process.exit(failed.length ? 1 : 0);
