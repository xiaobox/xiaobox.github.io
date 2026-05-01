#!/usr/bin/env node
// 批量清理 frontmatter 里的 tags：
//   R1 去除 category 同名 tag（行业与思考、杂谈、AI、系统底层）
//   R2 删除长尾噪音 tag
//   R3 合并同义 tag
//
// 用法: node scripts/cleanup-tags.mjs [--dry]

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve } from 'path';

const POSTS = 'content/post';
const DRY = process.argv.includes('--dry');

const REMOVE = new Set([
  '行业与思考', '杂谈', 'AI', '系统底层',
  'iPhone', 'Android',
]);

const MERGE = new Map([
  ['Anthropic', 'Claude'],
  ['vLLM', 'LLM'],
  ['KServe', 'Kubernetes'],
  ['程序员', '职场'],
  ['8小时工作制', '职场'],
  ['工伤', '职场'],
  ['员工手册', '职场'],
  ['劳动法', '职场'],
  ['5G', '网络'],
  ['运营商', '网络'],
  ['移动通信', '网络'],
]);

function parseFM(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

function extractTags(fm) {
  const lines = fm.split('\n');
  const tags = [];
  let inTags = false;
  for (const line of lines) {
    if (/^tags:\s*$/.test(line)) { inTags = true; continue; }
    if (inTags) {
      const m = line.match(/^\s+-\s+(.*?)\s*$/);
      if (m) { tags.push(m[1].replace(/^["']|["']$/g, '')); continue; }
      inTags = false;
    }
  }
  return tags;
}

function rewriteTags(fm, newTags) {
  const lines = fm.split('\n');
  const kept = [];
  let inTags = false;
  let inserted = false;
  for (const line of lines) {
    if (/^tags:\s*$/.test(line)) {
      inTags = true;
      kept.push('tags:');
      for (const t of newTags) kept.push(`  - ${t}`);
      inserted = true;
      continue;
    }
    if (inTags) {
      if (/^\s+-\s+/.test(line)) continue;
      inTags = false;
    }
    kept.push(line);
  }
  if (!inserted && newTags.length) {
    kept.push('tags:');
    for (const t of newTags) kept.push(`  - ${t}`);
  }
  if (inserted && newTags.length === 0) {
    return kept.filter((l, i) => l !== 'tags:').join('\n');
  }
  return kept.join('\n');
}

function cleanTags(tags) {
  const out = [];
  const seen = new Set();
  for (let t of tags) {
    if (REMOVE.has(t)) continue;
    if (MERGE.has(t)) t = MERGE.get(t);
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

const dirs = readdirSync(POSTS).filter((d) => statSync(resolve(POSTS, d)).isDirectory());
const stats = { total: 0, modified: 0, dropped: 0, merged: 0 };
const tagCount = {};

for (const dir of dirs) {
  const idx = resolve(POSTS, dir, 'index.md');
  let md;
  try { md = readFileSync(idx, 'utf8'); } catch { continue; }
  const parsed = parseFM(md);
  if (!parsed) continue;
  stats.total++;

  const oldTags = extractTags(parsed.fm);
  const newTags = cleanTags(oldTags);

  for (const t of newTags) tagCount[t] = (tagCount[t] || 0) + 1;

  if (oldTags.join('\n') === newTags.join('\n')) continue;

  stats.modified++;
  stats.dropped += oldTags.filter((t) => REMOVE.has(t)).length;
  stats.merged += oldTags.filter((t) => MERGE.has(t)).length;

  const newFm = rewriteTags(parsed.fm, newTags);
  const newMd = `---\n${newFm}\n---\n${parsed.body}`;
  if (!DRY) writeFileSync(idx, newMd);
}

console.log(`scanned ${stats.total} posts, modified ${stats.modified}${DRY ? ' (dry)' : ''}`);
console.log(`  removed ${stats.dropped} noise tags, merged ${stats.merged} synonym tags`);
console.log('\n--- tag distribution after cleanup ---');
Object.entries(tagCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
