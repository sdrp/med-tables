// Writes dist/sw.js with a precache list of every file in the built site, so
// tables and search work offline after the first visit. Runs after Pagefind.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = 'dist';
const skip = new Set(['sw.js']);
// Pagefind ships several UIs; the site only uses the default one.
const unused = /^pagefind\/(pagefind-(component-ui|modular-ui|highlight)\.|wasm\.unknown\.|playground\/)/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

// The manifest scope is the site base (e.g. "/med-tables/"), set in astro.config.mjs.
const base = JSON.parse(readFileSync(join(dist, 'manifest.webmanifest'), 'utf8')).scope;

const files = walk(dist)
  .map((p) => relative(dist, p).split(sep).join('/'))
  .filter((p) => !skip.has(p) && !unused.test(p) && !p.startsWith('.'))
  .sort();

const hash = createHash('sha256');
for (const f of files) hash.update(f).update(readFileSync(join(dist, f)));
const version = hash.digest('hex').slice(0, 12);

// Pages are requested as directories ("/tables/x/"), not ".../index.html".
const urls = files.map((f) => base + (f === 'index.html' ? '' : f.replace(/(^|\/)index\.html$/, '$1')));

const template = readFileSync('scripts/sw.template.js', 'utf8');
const sw = template
  .replace('__VERSION__', version)
  .replace('__BASE__', base)
  .replace('__PRECACHE__', JSON.stringify(urls, null, 2));
writeFileSync(join(dist, 'sw.js'), sw);

console.log(`sw.js: precaching ${urls.length} files (version ${version}).`);
