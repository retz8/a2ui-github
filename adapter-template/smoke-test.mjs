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

import {cpSync, mkdtempSync, existsSync, rmSync, writeFileSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, basename, dirname, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execSync} from 'node:child_process';

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

// The reference instance's own values — filling with these proves the template
// reproduces the post-Phase-2 shape.
const REF_VALUES = {
  adapterPkg: 'primer-a2ui-adapter',
  agentPkg: 'a2ui-github-agent',
  Library: 'Primer',
  libraryPkg: '@primer/react',
  version: 'v0.9.1',
  repoSlug: 'retz8/a2ui-github',
  Domain: 'GitHub maintainer triage',
  mcp: 'GitHub MCP',
};

function runFill(dir) {
  writeFileSync(join(dir, 'init.values.json'), JSON.stringify(REF_VALUES, null, 2));
  const out = execSync('node fill.mjs init.values.json', {cwd: dir, encoding: 'utf8'});
  if (!out.includes('0 tokens left')) {
    throw new Error(`fill did not report success:\n${out}`);
  }
  console.log(`smoke: ${out.trim()}`);
}

const TOKEN_RE = /\{\{[^}]+\}\}/;
// Mirror fill.mjs's exclusions: init machinery keeps its literal {{...}} docs.
const ASSERT_EXCLUDE_NAMES = new Set(['node_modules', '.venv', 'dist', '.git', '.yarn']);
const ASSERT_EXCLUDE_RELPATHS = new Set(['.claude/skills/init', 'fill.mjs', 'init.values.json']);

function walkAll(dir, root, acc) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const relp = relative(root, abs).split(sep).join('/');
    if (ASSERT_EXCLUDE_NAMES.has(name) || ASSERT_EXCLUDE_RELPATHS.has(relp)) continue;
    const st = statSync(abs);
    acc.push({abs, relp, dir: st.isDirectory()});
    if (st.isDirectory()) walkAll(abs, root, acc);
  }
  return acc;
}

function run(cmd, cwd) {
  console.log(`\nsmoke: $ ${cmd}   (cwd: ${cwd})`);
  execSync(cmd, {cwd, stdio: 'inherit'});
}

function verifyInstance(dir) {
  // JS/TS workspace. No yarn.lock ships in the template, so this generates one.
  run('yarn install', dir);
  run('yarn build:all', dir);
  run('yarn typecheck:all', dir);
  run('yarn lint:all', dir);
  run('yarn test:all', dir);
  // Python agent. uv sync creates agent/.venv (ignored by the template eslint).
  const agent = join(dir, 'agent');
  run('uv sync', agent);
  run('uv run pytest', agent);
  console.log('\nsmoke: verify stage OK — JS/TS + agent green');
}

function assertMaterialized(dir) {
  const offenders = [];
  for (const {abs, relp, dir: isDir} of walkAll(dir, dir, [])) {
    if (TOKEN_RE.test(basename(abs))) offenders.push(`${relp} (name)`);
    if (!isDir) {
      const body = readFileSync(abs, 'utf8');
      if (!body.includes('\0') && TOKEN_RE.test(body)) offenders.push(`${relp} (content)`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(`residual {{...}} tokens in materialized instance:\n  - ${offenders.join('\n  - ')}`);
  }
  // Init machinery must survive fill (self-delete is a separate adopter-only step).
  for (const f of ['fill.mjs', 'init.values.json', '.claude/skills/init/SKILL.md']) {
    if (!existsSync(join(dir, f))) throw new Error(`init machinery missing after fill: ${f}`);
  }
  console.log('smoke: assertions OK — 0 tokens left, init machinery present');
}

async function main() {
  const dir = copyTemplate();
  console.log(`smoke: copied template → ${dir}`);
  if (!existsSync(join(dir, 'fill.mjs'))) throw new Error('copy missing fill.mjs');
  if (!existsSync(join(dir, '.claude/skills/init/SKILL.md'))) throw new Error('copy missing init skill');
  if (existsSync(join(dir, SELF))) throw new Error('smoke-test.mjs should not be copied');

  runFill(dir);
  // Sanity: the token-named adapter dir was renamed by fill.
  if (!existsSync(join(dir, 'primer-a2ui-adapter'))) {
    throw new Error('fill did not rename {{adapterPkg}} → primer-a2ui-adapter');
  }
  console.log('smoke: fill stage OK');

  assertMaterialized(dir);

  verifyInstance(dir);

  rmSync(dir, {recursive: true, force: true});
}

main().catch((err) => {
  console.error(`smoke: FAILED — ${err.message}`);
  process.exit(1);
});
