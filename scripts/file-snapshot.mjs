#!/usr/bin/env node
/**
 * file-snapshot.mjs
 *
 * Snapshot / rollback helper for harness mutating scripts (R3 script-security).
 * Captures file contents before writes; restores on failure.
 */
import fs from 'node:fs';
import path from 'node:path';

export class FileSnapshot {
  /** @type {Map<string, string | null>} */
  #snapshots = new Map();

  /**
   * @param {string} root
   * @param {string[]} relPaths
   */
  capture(root, relPaths) {
    for (const rel of relPaths) {
      if (this.#snapshots.has(rel)) continue;
      const abs = path.join(root, rel);
      this.#snapshots.set(rel, fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null);
    }
  }

  /**
   * @param {string} root
   * @param {() => void} fn
   */
  apply(root, fn) {
    try {
      fn();
    } catch (err) {
      this.restore(root);
      throw err;
    }
  }

  /** @param {string} root */
  restore(root) {
    for (const [rel, content] of this.#snapshots) {
      const abs = path.join(root, rel);
      if (content === null) {
        if (fs.existsSync(abs)) fs.rmSync(abs, { force: true });
      } else {
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, content);
      }
    }
  }

  get size() {
    return this.#snapshots.size;
  }
}

/**
 * @param {string} root
 * @param {string} rel
 */
export function safeRead(root, rel) {
  try {
    return fs.readFileSync(path.join(root, rel), 'utf8');
  } catch {
    return '';
  }
}

/**
 * @param {string} root
 * @param {string} target
 */
export function isPathInsideRoot(root, target) {
  const absRoot = path.resolve(root);
  const absTarget = path.resolve(root, target);
  const rel = path.relative(absRoot, absTarget);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}