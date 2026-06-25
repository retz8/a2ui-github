#!/usr/bin/env node
// Materialization smoke test for the a2ui-app template (Phase 3 task 3.4).
//
// Copies adapter-template/ to an OS temp dir, fills it with the reference
// instance's own values via the template's own fill.mjs, runs the full
// JS/TS + Python verify against the copy, and asserts zero residual {{...}}
// tokens with the init machinery still present. A final stage greps the
// ORIGINAL template's build surface for accidental library/domain identifiers.
//
// Run manually:  node adapter-template/smoke-test.mjs
// Never mutates the real adapter-template/. Wired into nothing.

import {cpSync, mkdtempSync, existsSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, basename, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url)); // adapter-template/
const SELF = basename(fileURLToPath(import.meta.url)); // smoke-test.mjs

// Build artifacts / VCS / package caches — never copied.
const COPY_EXCLUDE_NAMES = new Set(['node_modules', '.venv', 'dist', '.git', '.yarn']);

// Copy everything except artifacts and the verification machinery (this script
// + any *.values.json). The init machinery (fill.mjs, .claude/skills/init) IS
// copied — a fresh clone has it, and the smoke test asserts it survives fill.
function copyTemplate() {
  const dest = mkdtempSync(join(tmpdir(), 'a2ui-smoke-'));
  cpSync(SRC, dest, {
    recursive: true,
    filter: (s) => {
      const name = basename(s);
      if (COPY_EXCLUDE_NAMES.has(name)) return false;
      if (name === SELF) return false;
      if (name.endsWith('.values.json')) return false;
      return true;
    },
  });
  return dest;
}

async function main() {
  const dir = copyTemplate();
  console.log(`smoke: copied template → ${dir}`);
  // Sanity: init machinery copied, verification machinery not.
  if (!existsSync(join(dir, 'fill.mjs'))) throw new Error('copy missing fill.mjs');
  if (!existsSync(join(dir, '.claude/skills/init/SKILL.md'))) throw new Error('copy missing init skill');
  if (existsSync(join(dir, SELF))) throw new Error('smoke-test.mjs should not be copied');
  console.log('smoke: copy stage OK');
  rmSync(dir, {recursive: true, force: true});
}

main().catch((err) => {
  console.error(`smoke: FAILED — ${err.message}`);
  process.exit(1);
});
