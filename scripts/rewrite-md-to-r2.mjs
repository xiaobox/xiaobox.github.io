#!/usr/bin/env node
// 把 content/post/<slug>/index.md 里的本地图片引用改写为 R2 公开 URL。
// 对象 key: post/<slug>/<filename>
// URL: ${R2_PUBLIC_BASE}/post/<slug>/<filename>
//
// 用法:
//   node --env-file=.env.r2 rewrite-md-to-r2.mjs [--dry]

import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS = resolve(ROOT, 'content/post');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

const BASE = process.env.R2_PUBLIC_BASE;
if (!BASE) { console.error('missing R2_PUBLIC_BASE'); process.exit(1); }
const baseClean = BASE.replace(/\/+$/, '');

const dirs = readdirSync(POSTS).filter(d => statSync(resolve(POSTS, d)).isDirectory());
const IMG_EXT = /\.(jpe?g|png|gif|webp|svg)$/i;

let changedFiles = 0, changedRefs = 0, totalRefs = 0;

for (const slug of dirs) {
  const idx = resolve(POSTS, slug, 'index.md');
  let md;
  try { md = readFileSync(idx, 'utf8'); } catch { continue; }
  const original = md;

  // Local images that exist in the dir
  const localFiles = new Set(
    readdirSync(resolve(POSTS, slug)).filter(f => IMG_EXT.test(f))
  );

  function rewriteRef(refPath) {
    // Skip absolute URLs already
    if (/^(https?:)?\/\//i.test(refPath)) return null;
    // Strip leading ./
    const clean = refPath.replace(/^\.\//, '');
    // Only rewrite if file actually exists locally (avoid false positives)
    if (!localFiles.has(clean)) return null;
    return `${baseClean}/post/${slug}/${clean}`;
  }

  // 1. Markdown image syntax: ![alt](path)
  md = md.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (m, p, url, q) => {
    totalRefs++;
    const newUrl = rewriteRef(url);
    if (!newUrl) return m;
    changedRefs++;
    return `${p}${newUrl}${q}`;
  });

  // 2. HTML <img src="path">
  md = md.replace(/(<img[^>]*\bsrc=["'])([^"']+)(["'])/g, (m, p, url, q) => {
    totalRefs++;
    const newUrl = rewriteRef(url);
    if (!newUrl) return m;
    changedRefs++;
    return `${p}${newUrl}${q}`;
  });

  // 3. Frontmatter image: cover.jpg
  md = md.replace(/^(image:\s*)(\S+)\s*$/m, (m, p, url) => {
    totalRefs++;
    const newUrl = rewriteRef(url);
    if (!newUrl) return m;
    changedRefs++;
    return `${p}${newUrl}`;
  });

  if (md !== original) {
    changedFiles++;
    if (!DRY) writeFileSync(idx, md);
  }
}

console.log(`scanned ${dirs.length} posts`);
console.log(`refs total=${totalRefs} rewritten=${changedRefs}`);
console.log(`files modified=${changedFiles}${DRY ? ' (dry)' : ''}`);
