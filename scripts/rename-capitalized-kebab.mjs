#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const manifestPath = path.join(root, 'rename-manifest-capitalized-kebab.tsv');
const apply = process.argv.includes('--apply');

const scopes = [path.join(root, 'docs'), path.join(root, 'static')];
const skipDirs = new Set(['.git', 'node_modules', '.docusaurus', 'build']);
const skipExtensions = new Set(['.pdf.mdx']);

function rel(p) {
  return path.relative(root, p).split(path.sep).join('/');
}

function normalizeName(name, isFile) {
  const ext = isFile ? path.extname(name) : '';
  const stem = isFile ? path.basename(name, ext) : name;

  // Keep section and root index docs stable for predictable Docusaurus routing.
  if (isFile && ext.toLowerCase() === '.md' && stem.toLowerCase() === 'index') {
    return name;
  }

  const ascii = stem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['"`]/g, ' ')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim();

  if (!ascii) return name;

  const words = ascii
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

  const base = words.join('-');
  return isFile ? `${base}${ext}` : base;
}

function walk(dir, entries = []) {
  if (!fs.existsSync(dir)) return entries;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    entries.push({ full, isDir: ent.isDirectory(), name: ent.name });
    if (ent.isDirectory()) walk(full, entries);
  }
  return entries;
}

function buildManifest() {
  const all = scopes.flatMap((s) => walk(s));
  const rows = [];

  for (const item of all) {
    const itemRel = rel(item.full);
    if (!item.isDir && itemRel.endsWith('.pdf.mdx')) continue;

    const parent = rel(path.dirname(item.full));
    const targetBase = normalizeName(item.name, !item.isDir);
    if (targetBase === item.name) continue;

    const to = parent === '.' ? targetBase : `${parent}/${targetBase}`;
    rows.push({ from: itemRel, to, isDir: item.isDir });
  }

  const collisions = [];
  const seen = new Map();
  for (const row of rows) {
    const key = row.to.toLowerCase();
    if (seen.has(key) && seen.get(key) !== row.from) {
      collisions.push([seen.get(key), row.from, row.to]);
    } else {
      seen.set(key, row.from);
    }
  }

  return { rows, collisions };
}

function writeManifest(rows) {
  const out = ['type\tfrom\tto'];
  for (const row of rows) {
    out.push(`${row.isDir ? 'dir' : 'file'}\t${row.from}\t${row.to}`);
  }
  fs.writeFileSync(manifestPath, `${out.join('\n')}\n`, 'utf8');
}

function ensureParentDir(targetAbs) {
  const parent = path.dirname(targetAbs);
  fs.mkdirSync(parent, { recursive: true });
}

function applyRenames(rows) {
  const dirs = rows.filter((r) => r.isDir).sort((a, b) => b.from.length - a.from.length);
  const files = rows.filter((r) => !r.isDir).sort((a, b) => b.from.length - a.from.length);
  const ordered = [...dirs, ...files];

  let renamed = 0;
  for (const row of ordered) {
    const fromAbs = path.join(root, row.from);
    const toAbs = path.join(root, row.to);

    if (!fs.existsSync(fromAbs)) continue;
    if (fromAbs === toAbs) continue;

    ensureParentDir(toAbs);

    // Case-only renames on macOS need a temporary path hop.
    if (fromAbs.toLowerCase() === toAbs.toLowerCase()) {
      const tmpAbs = `${fromAbs}.tmp-rename-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      fs.renameSync(fromAbs, tmpAbs);
      fs.renameSync(tmpAbs, toAbs);
    } else {
      fs.renameSync(fromAbs, toAbs);
    }
    renamed += 1;
  }

  return renamed;
}

const { rows, collisions } = buildManifest();
writeManifest(rows);

console.log(`manifest=${rel(manifestPath)}`);
console.log(`rename_candidates=${rows.length}`);
console.log(`dir_candidates=${rows.filter((r) => r.isDir).length}`);
console.log(`file_candidates=${rows.filter((r) => !r.isDir).length}`);
console.log(`collisions=${collisions.length}`);

if (collisions.length > 0) {
  for (const [a, b, t] of collisions.slice(0, 20)) {
    console.log(`collision=${a} | ${b} -> ${t}`);
  }
  process.exit(2);
}

if (!apply) {
  console.log('mode=dry-run');
  process.exit(0);
}

const renamed = applyRenames(rows);
console.log(`renamed=${renamed}`);
console.log('mode=apply');
