#!/usr/bin/env node
// Mechanical placeholder-fill for the a2ui-app template.
//
// Non-interactive: reads a values JSON, substitutes the 8 known tokens across
// file contents and file/directory names, renames token-named paths, then
// asserts no {{...}} tokens remain. Values in, filled tree out — never prompts.
//
//   node fill.mjs [values.json]      (default values file: ./init.values.json)
//
// This script, the values file, and the init skill (.claude/skills/init) are
// INIT MACHINERY, not template content: they are excluded from the scan, fill,
// rename, and assertion below, and are removed by the init skill's guarded
// self-delete — never by this script. That exclusion is what lets the 3.4 smoke
// test assert both "zero {{...}} tokens remain" and "init files still present".

import {readFileSync, writeFileSync, readdirSync, statSync, renameSync} from 'node:fs';
import {join, relative, basename, dirname, sep, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const TOKENS = [
  'adapterPkg',
  'agentPkg',
  'Library',
  'libraryPkg',
  'version',
  'repoSlug',
  'Domain',
  'mcp',
];

const ROOT = dirname(fileURLToPath(import.meta.url));
const SELF = basename(fileURLToPath(import.meta.url));
// The values file is an instance-root artifact next to this script, so a relative
// argument resolves against ROOT (not the caller's cwd); absolute paths are honored.
const valuesPath = process.argv[2]
  ? isAbsolute(process.argv[2])
    ? process.argv[2]
    : join(ROOT, process.argv[2])
  : join(ROOT, 'init.values.json');

// --- load + validate the values file -----------------------------------------
let values;
try {
  values = JSON.parse(readFileSync(valuesPath, 'utf8'));
} catch (err) {
  console.error(`fill: cannot read values file at ${valuesPath}: ${err.message}`);
  process.exit(1);
}
const missing = TOKENS.filter(t => typeof values[t] !== 'string' || values[t].trim() === '');
if (missing.length > 0) {
  console.error(`fill: values file is missing non-empty values for: ${missing.join(', ')}`);
  process.exit(1);
}

// --- exclusions (relative to ROOT, POSIX-style) ------------------------------
const EXCLUDED_NAMES = new Set(['.git', 'node_modules', '.venv', 'dist', '.yarn']);
const EXCLUDED_RELPATHS = new Set(['.claude/skills/init']);
const EXCLUDED_FILES = new Set([SELF, basename(valuesPath)]);

const rel = abs => relative(ROOT, abs).split(sep).join('/');

function isExcludedDir(abs) {
  return EXCLUDED_NAMES.has(basename(abs)) || EXCLUDED_RELPATHS.has(rel(abs));
}
function isExcludedFile(abs) {
  return EXCLUDED_FILES.has(basename(abs)) || EXCLUDED_RELPATHS.has(rel(abs));
}

// --- token substitution ------------------------------------------------------
const TOKEN_RE = /\{\{[^}]+\}\}/;
function substitute(str) {
  let out = str;
  for (const t of TOKENS) out = out.split('{{' + t + '}}').join(values[t]);
  return out;
}

// --- walk helpers ------------------------------------------------------------
function walkFiles(dir, acc) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (isExcludedDir(abs)) continue;
      walkFiles(abs, acc);
    } else if (st.isFile()) {
      if (isExcludedFile(abs)) continue;
      acc.push(abs);
    }
  }
  return acc;
}
function walkAllPaths(dir, acc) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (isExcludedDir(abs)) continue;
      acc.push(abs);
      walkAllPaths(abs, acc);
    } else if (st.isFile()) {
      if (isExcludedFile(abs)) continue;
      acc.push(abs);
    }
  }
  return acc;
}

// 1) fill file CONTENTS
let filledFiles = 0;
for (const file of walkFiles(ROOT, [])) {
  const before = readFileSync(file, 'utf8');
  if (before.includes('\0')) continue; // skip binary
  const after = substitute(before);
  if (after !== before) {
    writeFileSync(file, after);
    filledFiles += 1;
  }
}

// 2) rename token-named PATHS, deepest-first
const paths = walkAllPaths(ROOT, []).sort(
  (a, b) => rel(b).split('/').length - rel(a).split('/').length,
);
let renamed = 0;
for (const abs of paths) {
  const name = basename(abs);
  const next = substitute(name);
  if (next !== name) {
    renameSync(abs, join(dirname(abs), next));
    renamed += 1;
  }
}

// 3) assert no tokens remain in the filled set (contents + names)
const offenders = [];
for (const abs of walkAllPaths(ROOT, [])) {
  if (TOKEN_RE.test(basename(abs))) offenders.push(`${rel(abs)} (name)`);
  if (statSync(abs).isFile()) {
    const body = readFileSync(abs, 'utf8');
    if (!body.includes('\0') && TOKEN_RE.test(body)) offenders.push(`${rel(abs)} (content)`);
  }
}
if (offenders.length > 0) {
  console.error('fill: residual {{...}} tokens found in:');
  for (const o of offenders) console.error(`  - ${o}`);
  process.exit(1);
}

console.log(
  `fill: done — ${filledFiles} file(s) filled, ${renamed} path(s) renamed, 0 tokens left.`,
);
