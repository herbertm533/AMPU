#!/usr/bin/env node
// playtestToText.mjs — turn a web-scraped AMPU playtest forum CSV into clean,
// chunked plain text that a subagent can actually read. The forum exports have
// raw HTML in a `Post` column and run to ~1MB / 17k lines, which is too large
// and too noisy to feed an agent directly.
//
// Usage:
//   node scripts/playtestToText.mjs <input.csv | input-dir> [more.csv ...] [--out <dir>]
//
// For each input CSV it writes, under <out>/<thread-slug>/:
//   - chunk-001.md, chunk-002.md, …  (clean text, ~50k chars each, post markers)
//   - manifest.json                  (thread slug, source file, post/char/chunk counts)
//
// Default <out> is docs/game/sources/ (gitignored — see .gitignore). The
// durable artifacts are the committed digest + living docs, not these chunks.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const CHUNK_TARGET_CHARS = 50000;

// --- tiny argv parse -------------------------------------------------------
const args = process.argv.slice(2);
let outDir = 'docs/game/sources';
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') { outDir = args[++i]; continue; }
  inputs.push(args[i]);
}
if (inputs.length === 0) {
  console.error('usage: node scripts/playtestToText.mjs <input.csv|dir> [...] [--out dir]');
  process.exit(1);
}

// Expand dirs to the .csv files they contain.
const csvFiles = [];
for (const p of inputs) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) {
      if (extname(f).toLowerCase() === '.csv') csvFiles.push(join(p, f));
    }
  } else {
    csvFiles.push(p);
  }
}

// --- RFC-4180-ish CSV parser (handles "" escapes + embedded newlines/commas) -
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\r') {
      // swallow; \n handles the row break
    } else if (c === '\n') {
      row.push(field); field = '';
      rows.push(row); row = [];
    } else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// --- HTML → readable text --------------------------------------------------
const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&mdash;': '—', '&ndash;': '–', '&hellip;': '…',
  '&ldquo;': '"', '&rdquo;': '"', '&lsquo;': "'", '&rsquo;': "'", '&times;': '×',
};
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&[a-z]+;/gi, (m) => ENTITIES[m] ?? m);
}
function htmlToText(html) {
  let s = html;
  s = s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  // Block-level tags become line breaks so paragraphs/lists stay legible.
  s = s.replace(/<\/(p|div|li|tr|h[1-6]|blockquote)>/gi, '\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<li\b[^>]*>/gi, '\n- ');
  s = s.replace(/<[^>]+>/g, '');           // strip remaining tags
  s = decodeEntities(s);
  s = s.replace(/[ \t]+/g, ' ');           // collapse runs of spaces
  s = s.replace(/ *\n */g, '\n');          // trim around newlines
  s = s.replace(/\n{3,}/g, '\n\n');        // cap blank-line runs
  return s.trim();
}

function slugify(name) {
  return basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// --- per-file processing ---------------------------------------------------
function processCsv(file) {
  const raw = readFileSync(file, 'utf8');
  const rows = parseCsv(raw);
  if (rows.length < 2) { console.warn(`skip (no data rows): ${file}`); return; }
  const header = rows[0].map((h) => h.trim());
  const postIdx = header.findIndex((h) => /^post$/i.test(h));
  const pageIdx = header.findIndex((h) => /pagination/i.test(h));
  const orderIdx = header.findIndex((h) => /order/i.test(h));
  if (postIdx === -1) { console.warn(`skip (no Post column): ${file}`); return; }

  const slug = slugify(file);
  const dir = join(outDir, slug);
  mkdirSync(dir, { recursive: true });

  const blocks = [];
  let posts = 0;
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const post = cells[postIdx];
    if (post == null || post.trim() === '') continue;
    const text = htmlToText(post);
    if (!text) continue;
    posts++;
    const page = pageIdx !== -1 ? (cells[pageIdx] || '').trim() : '';
    const order = orderIdx !== -1 ? (cells[orderIdx] || '').trim() : String(r);
    const marker = `\n\n===== POST ${posts} | row ${r}${page ? ` | page ${page}` : ''}${order ? ` | id ${order}` : ''} =====\n`;
    blocks.push(marker + text);
  }

  // Greedy pack blocks into ~CHUNK_TARGET_CHARS chunks.
  const chunks = [];
  let buf = '';
  for (const b of blocks) {
    if (buf.length > 0 && buf.length + b.length > CHUNK_TARGET_CHARS) {
      chunks.push(buf); buf = '';
    }
    buf += b;
  }
  if (buf.trim()) chunks.push(buf);

  let totalChars = 0;
  chunks.forEach((c, i) => {
    const n = String(i + 1).padStart(3, '0');
    const head = `# ${slug} — chunk ${i + 1}/${chunks.length}\n` +
      `# source: ${basename(file)}\n`;
    writeFileSync(join(dir, `chunk-${n}.md`), head + c, 'utf8');
    totalChars += c.length;
  });

  const manifest = {
    slug,
    source: basename(file),
    posts,
    chunks: chunks.length,
    totalChars,
    chunkFiles: chunks.map((_, i) => `chunk-${String(i + 1).padStart(3, '0')}.md`),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`${slug}: ${posts} posts → ${chunks.length} chunks (${(totalChars / 1000).toFixed(0)}k chars) → ${dir}`);
}

for (const f of csvFiles) processCsv(f);
