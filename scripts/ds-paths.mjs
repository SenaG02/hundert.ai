#!/usr/bin/env node
/**
 * ds-paths.mjs - path helpers for builder (root ".") vs consumer (_ds/bundle) modes.
 */

/** @param {object} binding */
export function isBuilderBinding(binding) {
  return binding.hostMode === 'builder' || binding.root === '.' || binding.bindingSource === 'native-root';
}

/**
 * CSS / assets listed in manifest.globalCssPaths (relative to binding.root).
 * @param {object} binding
 * @param {string} relPath
 */
export function assetHref(binding, relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (!binding.root || binding.root === '.') return normalized;
  return `${binding.root}/${normalized}`;
}

/** binding.bundle is already project-relative. */
export function bundleHref(binding) {
  return binding.bundle.replace(/\\/g, '/');
}

/**
 * @param {object} binding
 * @param {string} relPath
 */
export function importPath(binding, relPath) {
  return assetHref(binding, relPath);
}
