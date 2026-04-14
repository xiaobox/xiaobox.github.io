#!/usr/bin/env node
// 全局 markdown 后处理: 修复微信公众号导出常见排版问题。
// 不重抓,只改本地 markdown。
//
// 修复项:
//   1. 行尾两空格(turndown 把 <br> 变成行尾 "  ",导致段落炸开)
//   2. 连续 ≥ 3 个空行 → 2 个空行
//   3. 隐形字符: \u200B (零宽空格), \u00A0 (NBSP), \u200C, \u200D, \uFEFF
//   4. 错误转义: \[ \] \( \) \! \. → 还原(在不破坏链接的前提下)
//   5. 空 fence 块 ``` ... ``` (内容只有空白)删除
//   6. 裸 fence 后启发式补语言: java/python/bash/sql/yaml/json/go/js/ts/rust/cpp
//   7. fence 前后强制空行(避免被段落吞)
//
// 用法:
//   node scripts/fix-md-formatting.mjs [--dry]

import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const POSTS = 'content/post';
const DRY = process.argv.includes('--dry');

// ============================================================
// 启发式语言识别(用于裸 fence)
// ============================================================
function guessLang(code) {
  const c = code.trim();
  if (!c) return '';

  // 优先级从高到低
  // Java
  if (/\b(public|private|protected)\s+(static\s+)?(class|interface|void|int|String)\b/.test(c)) return 'java';
  if (/\bSystem\.out\.println\b|\bnew\s+\w+<.+>\(\)/.test(c)) return 'java';
  if (/^\s*import\s+java\./m.test(c)) return 'java';
  if (/@(Override|Service|Component|Autowired|RequestMapping|GetMapping|PostMapping)\b/.test(c)) return 'java';
  // Python
  if (/^\s*def\s+\w+\s*\(.*\)\s*:/m.test(c)) return 'python';
  if (/^\s*from\s+\w+\s+import\s+/m.test(c)) return 'python';
  if (/^\s*import\s+(os|sys|json|re|numpy|pandas|torch)\b/m.test(c)) return 'python';
  if (/print\s*\(.*\)/.test(c) && !/console\.log/.test(c)) return 'python';
  // Go
  if (/^\s*package\s+\w+\s*$/m.test(c) && /\bfunc\s+\w+/.test(c)) return 'go';
  if (/\bfmt\.Println\b/.test(c)) return 'go';
  // Rust
  if (/\bfn\s+\w+\s*\(/.test(c) && /\blet\s+(mut\s+)?\w+/.test(c)) return 'rust';
  // TypeScript
  if (/\b(interface|type)\s+\w+\s*=?\s*\{/.test(c) && /:\s*(string|number|boolean)/.test(c)) return 'typescript';
  // JavaScript
  if (/\b(const|let|var)\s+\w+\s*=/.test(c) && /=>|function\s*\(/.test(c)) return 'javascript';
  if (/\bconsole\.log\b/.test(c)) return 'javascript';
  // C/C++
  if (/^\s*#include\s*<\w+/m.test(c)) return /\bstd::/.test(c) ? 'cpp' : 'c';
  // SQL
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/im.test(c)) return 'sql';
  // YAML
  if (/^[a-zA-Z_][\w-]*:\s*(\w|$)/m.test(c) && /^\s+- /m.test(c)) return 'yaml';
  if (/^[a-zA-Z_][\w-]*:\s*\n\s+\w/m.test(c)) return 'yaml';
  // JSON
  if (/^\s*\{[\s\S]*"[\w-]+"\s*:/m.test(c) && /[\}\]]\s*$/.test(c)) return 'json';
  // Bash / Shell
  if (/^\s*(\$\s+|sudo\s+|cd\s+|ls\s+|grep\s+|curl\s+|wget\s+|brew\s+|apt\s+|npm\s+|yarn\s+|git\s+|docker\s+|kubectl\s+)/m.test(c)) return 'bash';
  if (/^\s*#!\/bin\/(ba)?sh/m.test(c)) return 'bash';
  // HTML/XML
  if (/^\s*<\?xml/m.test(c)) return 'xml';
  if (/<\/?[a-z][\w-]*[^>]*>/i.test(c) && /<\/[a-z]/i.test(c)) return 'html';
  // Dockerfile
  if (/^\s*FROM\s+\w+/m.test(c) && /^\s*(RUN|CMD|COPY|EXPOSE|ENV)\s/m.test(c)) return 'dockerfile';
  // Nginx
  if (/^\s*(server|location|upstream)\s*\{/m.test(c)) return 'nginx';

  return '';
}

// ============================================================
// 主处理函数
// ============================================================
function fix(md) {
  const stats = { trail2sp: 0, blankLines: 0, invisible: 0, escapes: 0, emptyFence: 0, langAdded: 0, fenceSpacing: 0 };

  // 拆分 frontmatter / body
  const m = md.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!m) return { md, stats };
  const fm = m[1];
  let body = m[2];

  // 1. 隐形字符
  const before1 = body.length;
  body = body.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
  body = body.replace(/\u00A0/g, ' ');
  stats.invisible = before1 - body.length;

  // 2. 错误转义(turndown 转义太激进)
  // 还原 \[, \], \(, \), \!, \., \-, \+, \=, \>, \<
  // 注意: 不能破坏代码块内的内容,所以先按 fence 拆开处理
  const codeBlockRegex = /^```[\s\S]*?^```$/gm;
  const segments = [];
  let last = 0;
  for (const fenceMatch of body.matchAll(codeBlockRegex)) {
    segments.push({ text: body.slice(last, fenceMatch.index), inCode: false });
    segments.push({ text: fenceMatch[0], inCode: true });
    last = fenceMatch.index + fenceMatch[0].length;
  }
  segments.push({ text: body.slice(last), inCode: false });

  for (const seg of segments) {
    if (seg.inCode) continue;
    const before = seg.text.length;
    // 还原过度转义,但保留 markdown 链接里需要的(比如 \[label\] 不是链接 → 应该还原)
    seg.text = seg.text
      .replace(/\\([!.\-+=<>])/g, '$1')
      .replace(/\\([\[\]()])/g, '$1');  // 谨慎: 链接里的 \[ 已经被 turndown 输出为 [
    stats.escapes += before - seg.text.length;
  }
  body = segments.map((s) => s.text).join('');

  // 3. 行尾两空格(强制换行) - 但代码块内不动
  const lines2 = body.split('\n');
  let inCode = false;
  for (let i = 0; i < lines2.length; i++) {
    if (/^```/.test(lines2[i])) { inCode = !inCode; continue; }
    if (inCode) continue;
    if (/  +$/.test(lines2[i])) {
      lines2[i] = lines2[i].replace(/  +$/, '');
      stats.trail2sp++;
    }
  }
  body = lines2.join('\n');

  // 4. 空 fence 块删除
  body = body.replace(/^```[a-z]*\n[\s\n]*```$/gm, () => {
    stats.emptyFence++;
    return '';
  });

  // 5. 裸 fence 启发式补语言
  body = body.replace(/^```\n([\s\S]*?)^```$/gm, (full, code) => {
    const lang = guessLang(code);
    if (!lang) return full;
    stats.langAdded++;
    return '```' + lang + '\n' + code + '```';
  });

  // 6. fence 前后强制空行(避免被段落粘住)
  // 处理 fence 上一行不为空的情况
  const lines3 = body.split('\n');
  const out = [];
  for (let i = 0; i < lines3.length; i++) {
    const cur = lines3[i];
    const isFence = /^```/.test(cur);
    if (isFence) {
      // 上一行如果非空且不是 fence,插入空行
      if (out.length > 0 && out[out.length - 1].trim() !== '' && !/^```/.test(out[out.length - 1])) {
        out.push('');
        stats.fenceSpacing++;
      }
      out.push(cur);
      continue;
    }
    out.push(cur);
  }
  body = out.join('\n');

  // 7. 折叠 ≥ 3 连续空行
  const before7 = (body.match(/\n{3,}/g) || []).length;
  body = body.replace(/\n{3,}/g, '\n\n');
  stats.blankLines = before7;

  // trim 文末空行 + 保证文件末尾一个 \n
  body = body.replace(/\n+$/, '\n');

  return { md: fm + body, stats };
}

// ============================================================
// 主流程
// ============================================================
const dirs = readdirSync(POSTS).filter((d) => statSync(resolve(POSTS, d)).isDirectory());
const totals = { posts: 0, modified: 0, trail2sp: 0, blankLines: 0, invisible: 0, escapes: 0, emptyFence: 0, langAdded: 0, fenceSpacing: 0 };
const langDist = {};

for (const dir of dirs) {
  const idx = resolve(POSTS, dir, 'index.md');
  let md;
  try { md = readFileSync(idx, 'utf8'); } catch { continue; }
  totals.posts++;

  const { md: newMd, stats } = fix(md);

  if (newMd !== md) {
    totals.modified++;
    for (const k of Object.keys(stats)) totals[k] = (totals[k] || 0) + stats[k];
    if (!DRY) writeFileSync(idx, newMd);
  }

  // 收集语言分布(包括所有 fence,不只新加的)
  for (const f of newMd.matchAll(/^```(\w+)/gm)) {
    langDist[f[1]] = (langDist[f[1]] || 0) + 1;
  }
}

console.log(`scanned ${totals.posts} posts, modified ${totals.modified}${DRY ? ' (dry)' : ''}`);
console.log('\n--- fixes ---');
console.log(`  行尾两空格删除  ${totals.trail2sp}`);
console.log(`  连续空行折叠    ${totals.blankLines}`);
console.log(`  隐形字符删除    ${totals.invisible}`);
console.log(`  过度转义还原    ${totals.escapes}`);
console.log(`  空 fence 删除   ${totals.emptyFence}`);
console.log(`  代码块加 lang   ${totals.langAdded}`);
console.log(`  fence 前补空行  ${totals.fenceSpacing}`);
console.log('\n--- 现存代码块语言分布 ---');
Object.entries(langDist).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
