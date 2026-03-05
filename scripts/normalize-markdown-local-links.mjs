#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else if (ent.isFile() && full.endsWith('.md')) acc.push(full);
  }
  return acc;
}

function normalizeBaseName(name) {
  const ext = path.extname(name);
  const stem = path.basename(name, ext);
  if (stem.toLowerCase() === 'index') return name;

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

  return `${words.join('-')}${ext}`;
}

function normalizeUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('#')) return url;
  if (url.startsWith('pathname://')) return url;

  const [pathPart, suffix = ''] = url.split(/([?#].*)/, 2);

  let decoded;
  try {
    decoded = decodeURIComponent(pathPart);
  } catch {
    decoded = pathPart;
  }

  const slash = decoded.lastIndexOf('/');
  const dir = slash >= 0 ? decoded.slice(0, slash + 1) : '';
  const base = slash >= 0 ? decoded.slice(slash + 1) : decoded;

  if (!base || !base.includes('.')) return url;

  const normalizedBase = normalizeBaseName(base);
  if (normalizedBase === base) return url;

  const rebuilt = `${dir}${normalizedBase}`;
  // Keep slashes and common URL chars readable.
  const encoded = rebuilt
    .split('/')
    .map((seg) => encodeURIComponent(seg).replace(/%2D/g, '-'))
    .join('/');

  return `${encoded}${suffix}`;
}

const files = walk(path.join(root, 'docs'));
let changedFiles = 0;
let totalChanges = 0;

for (const file of files) {
  const input = fs.readFileSync(file, 'utf8');
  let output = input;

  // Normalize markdown link and image destinations: [x](url) and ![x](url)
  output = output.replace(/(!?\[[^\]]*\]\()([^\)]+)(\))/g, (m, p1, url, p3) => {
    const next = normalizeUrl(url.trim());
    if (next !== url.trim()) totalChanges += 1;
    return `${p1}${next}${p3}`;
  });

  if (output !== input) {
    fs.writeFileSync(file, output, 'utf8');
    changedFiles += 1;
    console.log(`updated=${path.relative(root, file)}`);
  }
}

console.log(`files_changed=${changedFiles}`);
console.log(`url_updates=${totalChanges}`);
