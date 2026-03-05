#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const manifestPath = path.join(root, 'rename-manifest-capitalized-kebab.tsv');

if (!fs.existsSync(manifestPath)) {
  console.error('Missing rename manifest:', manifestPath);
  process.exit(1);
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === '.git' || ent.name === 'node_modules' || ent.name === '.docusaurus' || ent.name === 'build') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.isFile() && (full.endsWith('.md') || full.endsWith('.mdx'))) acc.push(full);
  }
  return acc;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const lines = fs.readFileSync(manifestPath, 'utf8').trim().split('\n').slice(1);
const renameRows = lines
  .map((line) => line.split('\t'))
  .filter((parts) => parts.length === 3 && parts[0] === 'file')
  .map(([, from, to]) => ({ from, to }));

const replacements = new Map();
for (const { from, to } of renameRows) {
  const oldBase = path.basename(from);
  const newBase = path.basename(to);
  if (oldBase === newBase) continue;

  const oldEnc = encodeURIComponent(oldBase);
  const newEnc = encodeURIComponent(newBase);

  replacements.set(oldBase, newBase);
  replacements.set(oldEnc, newEnc);
}

const files = walk(path.join(root, 'docs'));
let filesChanged = 0;
let totalReplacements = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let content = original;
  let countForFile = 0;

  for (const [from, to] of replacements.entries()) {
    const re = new RegExp(escapeRegExp(from), 'g');
    const matches = content.match(re);
    if (!matches) continue;
    countForFile += matches.length;
    content = content.replace(re, to);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    filesChanged += 1;
    totalReplacements += countForFile;
    console.log(`updated=${path.relative(root, file)} replacements=${countForFile}`);
  }
}

console.log(`files_changed=${filesChanged}`);
console.log(`total_replacements=${totalReplacements}`);
