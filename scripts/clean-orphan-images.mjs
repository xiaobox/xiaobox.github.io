#!/usr/bin/env node
// 删除 content/post/*/ 目录里没被 index.md 引用的图片(force 重抓产生的废弃文件)
import { readdirSync, readFileSync, statSync, unlinkSync } from 'fs';
import { resolve } from 'path';

const POSTS = 'content/post';
const dirs = readdirSync(POSTS).filter(d => statSync(resolve(POSTS, d)).isDirectory());

let removed = 0, freed = 0, scanned = 0;

for (const dir of dirs) {
  const postDir = resolve(POSTS, dir);
  const idx = resolve(postDir, 'index.md');
  let md;
  try { md = readFileSync(idx, 'utf8'); } catch { continue; }

  // Referenced files: markdown image refs + frontmatter cover
  const refs = new Set();
  for (const m of md.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) refs.add(m[1]);
  for (const m of md.matchAll(/<img[^>]*src=["']([^"']+)["']/g)) refs.add(m[1]);
  const coverMatch = md.match(/^image:\s*(\S+)\s*$/m);
  if (coverMatch) refs.add(coverMatch[1]);

  // Local image files in dir
  const files = readdirSync(postDir).filter(f =>
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f) && f !== 'index.md'
  );
  scanned += files.length;

  for (const f of files) {
    if (!refs.has(f)) {
      const sz = statSync(resolve(postDir, f)).size;
      unlinkSync(resolve(postDir, f));
      removed++;
      freed += sz;
    }
  }
}

console.log(`scanned ${scanned} images, removed ${removed} orphans, freed ${(freed/1024/1024).toFixed(1)} MB`);
