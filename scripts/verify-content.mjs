#!/usr/bin/env node
// 验证已导入文章的完整性。
// 1. 扫 content/post 所有 index.md
// 2. 取 markdown 正文(去掉 frontmatter)字符数
// 3. 对小于阈值的(可疑)用 chrome 重新拉原文,对比真实文本长度
// 4. 输出可疑列表(原文有内容但本地几乎为空)到 /tmp/wx-data/suspicious.json

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS_DIR = resolve(ROOT, 'content/post');

const TARGET = process.argv[2];
if (!TARGET) { console.error('usage: verify-content.mjs <chrome-target> [--threshold N]'); process.exit(1); }
const thIdx = process.argv.indexOf('--threshold');
const THRESHOLD = thIdx >= 0 ? parseInt(process.argv[thIdx + 1], 10) : 2000;

const CDP = '/Users/helong/.claude/skills/chrome-cdp/scripts/cdp.mjs';
const PORT_FILE = '/tmp/chrome-cdp-profile/DevToolsActivePort';

function execCdp(args) {
  return new Promise((res, rej) => {
    const env = { ...process.env, CDP_PORT_FILE: PORT_FILE };
    const p = spawn(CDP, args, { env });
    let out = ''; let err = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (err += d));
    p.on('error', rej);
    p.on('exit', (code) => (code === 0 ? res(out) : rej(new Error(`cdp ${args[0]}: ${err}`))));
  });
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: md };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].replace(/^"|"$/g, '');
  }
  return { fm, body: m[2] };
}

// strip markdown to plain text-ish for length compare
function plainLen(md) {
  return md
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '') // images/links
    .replace(/[#*_>`~|\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim().length;
}

const dirs = readdirSync(POSTS_DIR).filter((d) => {
  try { return statSync(resolve(POSTS_DIR, d)).isDirectory(); } catch { return false; }
});

const suspects = [];
const summary = { totalDirs: dirs.length, smallLocal: 0, checked: 0, suspicious: 0, errors: 0 };

let processed = 0;
for (const dir of dirs) {
  processed++;
  const idx = resolve(POSTS_DIR, dir, 'index.md');
  if (!existsSync(idx)) continue;
  const md = readFileSync(idx, 'utf8');
  const { fm, body } = parseFrontmatter(md);
  const localLen = plainLen(body);

  if (localLen >= THRESHOLD) continue;
  summary.smallLocal++;

  const url = fm.original_url;
  if (!url) continue;

  process.stdout.write(`[${processed}/${dirs.length}] ${dir.slice(0,50)} local=${localLen} `);
  try {
    await execCdp(['nav', TARGET, url]);
    await new Promise(r => setTimeout(r, 1500));
    const probe = await execCdp(['eval', TARGET,
      '(()=>{const c=document.querySelector("#js_content");return JSON.stringify({textLen:c?.innerText?.trim()?.length||0, htmlLen:c?.innerHTML?.length||0});})()']);
    const real = JSON.parse(probe.trim());
    summary.checked++;
    process.stdout.write(`real=${real.textLen} (html ${real.htmlLen})`);

    // suspicious if real > 200 AND real > local * 2.5
    if (real.textLen > 200 && real.textLen > localLen * 2.5) {
      suspects.push({ dir, url, localLen, realLen: real.textLen, realHtmlLen: real.htmlLen });
      summary.suspicious++;
      process.stdout.write(' SUSPECT');
    }
    process.stdout.write('\n');
  } catch (e) {
    summary.errors++;
    process.stdout.write(` ERROR: ${e.message}\n`);
  }
}

writeFileSync('/tmp/wx-data/suspicious.json', JSON.stringify({ summary, suspects }, null, 2));
console.log('\n=== summary ===');
console.log(JSON.stringify(summary, null, 2));
console.log(`saved suspects to /tmp/wx-data/suspicious.json`);
