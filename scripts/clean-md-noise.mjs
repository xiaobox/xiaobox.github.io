#!/usr/bin/env node
// 清理 markdown 中的微信噪音(赞赏面板、视频播放器、评论面板等),
// 并报告清理后正文过短的文章(待删除候选)。
//
// 用法:
//   node scripts/clean-md-noise.mjs [--dry] [--min N]

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { resolve } from 'path';

const POSTS = 'content/post';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const MIN_BODY = parseInt(args[args.indexOf('--min') + 1] ?? '80', 10) || 80;

// 截断 markers: 出现后,该行及之后所有内容删除
const TRUNCATE_MARKERS = [
  '**微信扫一扫赞赏作者**',
  '微信扫一扫赞赏作者',
  'Replay Share Like',           // 视频卡片标志
  'Your browser does not support video tags',
  'Added to Top Stories',
  '[Video Details]',
];

// 行级删除(整行匹配后整行删除)
const STRIP_LINES = [
  /^Name cleared$/,
  /^已关注$/,
  /^Follow$/,
  /^Close$/,
  /^更多$/,
  /^OK$/,
  /^Back$/,
  /^Other Amount$/,
  /^¥$/,
  /^最低赞赏 ¥0$/,
  /^Like the Author.*/,
  /^\*\*Other Amount\*\*$/,
  /^赞赏金额$/,
  /^赞赏后展示我的头像$/,
  /^作品$/,
  /^暂无作品$/,
  /^[0-9]$/,                     // 数字键盘的 0-9 单字行
  /^\.$/,                        // 数字键盘的 .
  /^Share Video$/,
  /^Share点赞Wow$/,
  /^切换到横屏模式$/,
  /^继续播放$/,
  /^继续观看$/,
  /^观看更多$/,
  /^\*\*观看更多\*\*$/,
  /^转载$/,
  /^,$/,
  /^进度条，百分之0$/,
  /^倍速播放中$/,
  /^\*退出全屏\*$/,
  /^\*切换到竖屏全屏\*\*退出全屏\*$/,
  /^\*全屏\*$/,
  /^\[\]\(javascript:;\)$/,
  /^\[Play\]\(javascript:;\)$/,
  /^\[倍速\]\(javascript:;\)$/,
  /^\[\d+\.?\d*倍\]\(javascript:;\)( \[\d+\.?\d*倍\]\(javascript:;\))*$/,
  /^\[超清\]\(javascript:;\)( \[流畅\]\(javascript:;\))?$/,
  /^\[流畅\]\(javascript:;\)$/,
  /^\d{2}:\d{2}$/,               // 00:00
  /^\d{2}:\d{2}\/\d{2}:\d{2}$/,  // 00:00/09:30
  /^[0-9]+\/[0-9]+$/,            // 0/0
  /^\/$/,
  /^，时长\d{2}:\d{2}$/,
  /^小盒子的技术分享已关注$/,
];

// 行级删除(行尾匹配)
const STRIP_PATTERNS_INLINE = [
];

const dirs = readdirSync(POSTS).filter((d) => statSync(resolve(POSTS, d)).isDirectory());

let modified = 0, totalRemoved = 0;
const empty = [];
const cleaned = [];

for (const dir of dirs) {
  const idx = resolve(POSTS, dir, 'index.md');
  if (!existsSync(idx)) continue;
  const md = readFileSync(idx, 'utf8');
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) continue;
  const fm = m[1];
  const originalBody = m[2];
  let body = originalBody;

  // 1. Truncate at earliest noise marker
  let truncateAt = body.length;
  for (const marker of TRUNCATE_MARKERS) {
    const i = body.indexOf(marker);
    if (i >= 0 && i < truncateAt) truncateAt = i;
  }
  body = body.slice(0, truncateAt);

  // 2. Strip noise lines
  body = body
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (!t) return true; // keep empty lines for now
      return !STRIP_LINES.some((re) => re.test(t));
    })
    .join('\n');

  // 3. Collapse blank lines, trim
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  // 4. Plain text length
  const plain = body
    .replace(/!?\[[^\]]*\]\([^)\s]*\)/g, '')
    .replace(/[#*_>`~|\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const newMd = `---\n${fm}\n---\n${body}\n`;

  if (newMd !== md) {
    modified++;
    totalRemoved += md.length - newMd.length;
    cleaned.push({ dir, oldLen: md.length, newLen: newMd.length, plainLen: plain.length });
    if (!DRY) writeFileSync(idx, newMd);
  }

  if (plain.length < MIN_BODY) {
    empty.push({ dir, plainLen: plain.length, preview: plain.slice(0, 120) });
  }
}

empty.sort((a, b) => a.plainLen - b.plainLen);
writeFileSync('/tmp/wx-data/empty.json', JSON.stringify(empty, null, 2));

console.log(`scanned ${dirs.length} posts`);
console.log(`modified ${modified}${DRY ? ' (dry)' : ''}, removed ${totalRemoved} bytes total`);
console.log(`empty (< ${MIN_BODY} plain chars) ${empty.length} → /tmp/wx-data/empty.json`);
if (empty.length) {
  console.log('\n--- shortest 10 (待删除候选) ---');
  empty.slice(0, 10).forEach((e) => console.log(`  ${e.plainLen}c  ${e.dir}\n         "${e.preview}"`));
}
