#!/usr/bin/env node
// Import 微信公众号文章 → Hugo content/post/<slug>/{index.md, images/*}
//
// Usage:
//   node scripts/import-wx.mjs <articles.json> [--limit N] [--start N] [--force]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { spawn } from 'child_process';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { slugifyArticle, uniqueSlug } from './slugify.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS_DIR = resolve(ROOT, 'content/post');

const args = process.argv.slice(2);
const jsonPath = args[0];
if (!jsonPath) { console.error('usage: import-wx.mjs <articles.json> [--limit N] [--start N] [--force]'); process.exit(1); }
const limit = parseInt(args[args.indexOf('--limit') + 1] ?? '0', 10) || Infinity;
const start = parseInt(args[args.indexOf('--start') + 1] ?? '0', 10) || 0;
const force = args.includes('--force');
const chromeTargetIdx = args.indexOf('--chrome-target');
const CHROME_TARGET = chromeTargetIdx >= 0 ? args[chromeTargetIdx + 1] : null;
const CHROME_PORT_FILE = process.env.CDP_PORT_FILE || '/tmp/chrome-cdp-profile/DevToolsActivePort';
const CDP_BIN = '/Users/helong/.claude/skills/chrome-cdp/scripts/cdp.mjs';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});
td.use(gfm);
// Strip empty paragraphs and inline section/span wrappers
td.addRule('section', { filter: ['section'], replacement: (c) => c });
td.addRule('span', { filter: ['span'], replacement: (c) => c });

// slug now provided via global map computed in main()

function frontmatter(meta) {
  const lines = ['---'];
  lines.push(`title: ${JSON.stringify(meta.title)}`);
  if (meta.slug) lines.push(`slug: ${meta.slug}`);
  if (meta.description) lines.push(`description: ${JSON.stringify(meta.description)}`);
  lines.push(`date: ${meta.date}`);
  if (meta.image) lines.push(`image: ${meta.image}`);
  if (meta.categories?.length) {
    lines.push('categories:');
    meta.categories.forEach((c) => lines.push(`  - ${c}`));
  }
  if (meta.tags?.length) {
    lines.push('tags:');
    meta.tags.forEach((t) => lines.push(`  - ${t}`));
  }
  if (meta.original_url) lines.push(`original_url: ${meta.original_url}`);
  lines.push('---', '');
  return lines.join('\n');
}

function execCdp(cdpArgs) {
  return new Promise((res, rej) => {
    const env = { ...process.env, CDP_PORT_FILE: CHROME_PORT_FILE };
    const p = spawn(CDP_BIN, cdpArgs, { env });
    // 收集 Buffer 后一次性 decode,避免 UTF-8 多字节字符跨 chunk 边界产生替换符
    const outChunks = [];
    const errChunks = [];
    p.stdout.on('data', (d) => outChunks.push(d));
    p.stderr.on('data', (d) => errChunks.push(d));
    p.on('error', rej);
    p.on('exit', (code) => {
      const out = Buffer.concat(outChunks).toString('utf8');
      const err = Buffer.concat(errChunks).toString('utf8');
      if (code === 0) res(out);
      else rej(new Error(`cdp ${cdpArgs[0]} exit ${code}: ${err}`));
    });
  });
}

async function fetchViaChrome(url) {
  await execCdp(['nav', CHROME_TARGET, url]);
  // 等待 #js_content 渲染。最多等 8s
  for (let i = 0; i < 16; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const probe = await execCdp(['eval', CHROME_TARGET,
      '(()=>{const el=document.querySelector("#js_content");return el?el.innerHTML.length:0;})()']);
    const len = parseInt(probe.trim(), 10);
    if (len > 100) break;
  }
  return await execCdp(['html', CHROME_TARGET]);
}

async function fetchText(url) {
  if (CHROME_TARGET) return await fetchViaChrome(url);

  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Referer': 'https://mp.weixin.qq.com/' } });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    const text = await r.text();
    // 风控:重定向到验证码页 (两种已知特征)
    if (text.includes('wappoc_appmsgcaptcha') || text.includes('secitptpage/verify') || (r.url && r.url.includes('wappoc_appmsgcaptcha'))) {
      const wait = 15000 * (attempt + 1);
      console.warn(`  ! captcha detected, waiting ${wait/1000}s before retry ${attempt + 1}/4`);
      await new Promise((res) => setTimeout(res, wait));
      continue;
    }
    return text;
  }
  throw new Error(`captcha persisted after retries: ${url}`);
}

async function fetchBinary(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Referer': 'https://mp.weixin.qq.com/' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const ct = r.headers.get('content-type') || '';
  return { buf, ct };
}

function extFromCT(ct, url) {
  if (/jpeg|jpg/.test(ct)) return '.jpg';
  if (/png/.test(ct)) return '.png';
  if (/gif/.test(ct)) return '.gif';
  if (/webp/.test(ct)) return '.webp';
  if (/svg/.test(ct)) return '.svg';
  // Try url query param wx_fmt
  const m = url.match(/wx_fmt=(\w+)/);
  if (m) return '.' + m[1].replace('jpeg', 'jpg');
  return '.jpg';
}

function imgFilename(url, idx) {
  const h = createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${String(idx).padStart(3, '0')}-${h}`;
}

// 全局图片缓存目录(跨文章+跨次运行复用)
const IMG_CACHE = '/tmp/wx-img-cache';
mkdirSync(IMG_CACHE, { recursive: true });

async function fetchBinaryCached(url) {
  const key = createHash('sha1').update(url).digest('hex');
  const ctFile = resolve(IMG_CACHE, key + '.ct');
  // try possible extensions
  for (const ext of ['.jpg', '.png', '.gif', '.webp', '.svg']) {
    const f = resolve(IMG_CACHE, key + ext);
    if (existsSync(f)) {
      const ct = existsSync(ctFile) ? readFileSync(ctFile, 'utf8') : 'image/jpeg';
      return { buf: readFileSync(f), ct, cached: true };
    }
  }
  const { buf, ct } = await fetchBinary(url);
  const ext = extFromCT(ct, url);
  writeFileSync(resolve(IMG_CACHE, key + ext), buf);
  writeFileSync(ctFile, ct);
  return { buf, ct, cached: false };
}

async function importArticle(article, idx, total, slugMap) {
  const slug = slugMap.get(article.url);
  const postDir = resolve(POSTS_DIR, slug);
  const indexFile = resolve(postDir, 'index.md');
  if (existsSync(indexFile) && !force) {
    console.log(`[${idx + 1}/${total}] SKIP ${slug} (exists)`);
    return { ok: true, skipped: true, slug };
  }
  console.log(`[${idx + 1}/${total}] ${slug}  ${article.title}`);

  const html = await fetchText(article.url);
  const $ = cheerio.load(html);

  // Pull title from page if available; fallback to api title
  const pageTitle = ($('#activity-name').text() || article.title).trim();

  // Extract content body
  const $content = $('#js_content');
  if (!$content.length) {
    console.warn(`  ! no #js_content for ${slug}`);
    return { ok: false, slug, error: 'no content' };
  }

  // 移除 script/style/noscript - 微信 #js_content 里偶尔嵌入 inline script,
  // cheerio 把 script 内容当 text 吸进 markdown,产生大段污染
  $content.find('script, style, noscript').remove();

  // 微信代码块有多种格式:
  // 1) section.code-snippet__fix > ol > li (mdnice/markdown.com.cn)
  // 2) pre.code-snippet__js > code (each <code> = one line)
  // 3) <pre><code>...</code></pre> 普通格式
  // 4) section[data-tool="mdnice编辑器"] 嵌套包装
  function rebuildCodeBlock(text, lang, $el) {
    const $pre = $('<pre></pre>');
    const $code = $('<code></code>');
    if (lang) $code.attr('class', 'language-' + lang);
    $code.text(text);
    $pre.append($code);
    $el.replaceWith($pre);
  }

  // Format 0: mdnice 编辑器的 pre, 内部用 <br> 做换行(cheerio.text() 默认丢失换行)
  // 也覆盖任何含 <br> 子节点的 <pre>(通用兜底)
  $content.find('pre').each((_, el) => {
    const $el = $(el);
    // 跳过已处理的(避免重复)
    if ($el.attr('data-imported')) return;
    // 只处理含 br 的 pre
    if ($el.find('br').length === 0) return;
    // 把 br 替换为换行字符
    $el.find('br').replaceWith('\n');
    // 取 text(此时换行已是 \n)
    const text = $el.text();
    const lang = ($el.attr('data-lang') || '').trim();
    rebuildCodeBlock(text, lang, $el);
  });

  // Format 2: pre.code-snippet__js (微信公众号默认代码块)
  // Replace the OUTER container if pre is wrapped in section.code-snippet__fix,
  // otherwise replace the pre itself.
  $content.find('pre.code-snippet__js').each((_, el) => {
    const $el = $(el);
    const lang = ($el.attr('data-lang') || $el.closest('[data-lang]').attr('data-lang') || '').trim();
    // 每个直接子 <code> 是一行
    const lines = $el.children('code').map((_, c) => $(c).text()).get();
    const text = lines.length ? lines.join('\n') : $el.text();
    const $outer = $el.closest('section.code-snippet__fix');
    const $target = $outer.length ? $outer : $el;
    rebuildCodeBlock(text, lang, $target);
  });

  // Format 1: 残留的 section.code-snippet__fix(没有内层 pre 的情况, ol/li 格式)
  $content.find('section.code-snippet__fix').each((_, el) => {
    const $el = $(el);
    const lang = ($el.attr('data-lang') || '').trim();
    const text = $el.find('li').map((_, li) => $(li).text()).get().join('\n')
      || $el.text();
    if (text.trim()) rebuildCodeBlock(text, lang, $el);
  });

  // Image normalization: data-src → src
  mkdirSync(postDir, { recursive: true });

  const imgUrls = [];
  $content.find('img').each((_, el) => {
    const $img = $(el);
    const src = $img.attr('data-src') || $img.attr('src');
    if (!src || src.startsWith('data:')) { $img.remove(); return; }
    imgUrls.push(src);
  });

  // Download images (cached + parallel within an article)
  const urlToLocal = new Map();
  const uniqueUrls = [...new Set(imgUrls)];
  const PAR = 5;
  for (let i = 0; i < uniqueUrls.length; i += PAR) {
    const batch = uniqueUrls.slice(i, i + PAR);
    await Promise.all(batch.map(async (u, k) => {
      try {
        const { buf, ct } = await fetchBinaryCached(u);
        const ext = extFromCT(ct, u);
        const name = imgFilename(u, i + k + 1) + ext;
        writeFileSync(resolve(postDir, name), buf);
        urlToLocal.set(u, name);
      } catch (e) {
        console.warn(`  ! image fail: ${u} -- ${e.message}`);
      }
    }));
  }

  $content.find('img').each((_, el) => {
    const $img = $(el);
    const src = $img.attr('data-src') || $img.attr('src');
    const local = urlToLocal.get(src);
    if (local) {
      $img.attr('src', local);
      $img.removeAttr('data-src');
      const alt = $img.attr('alt') || '';
      if (!alt) $img.attr('alt', '');
    } else {
      $img.remove();
    }
  });

  // Cover image
  let coverLocal = null;
  if (article.cover) {
    try {
      const { buf, ct } = await fetchBinaryCached(article.cover);
      const ext = extFromCT(ct, article.cover);
      coverLocal = 'cover' + ext;
      writeFileSync(resolve(postDir, coverLocal), buf);
    } catch (e) {
      console.warn(`  ! cover fail: ${e.message}`);
    }
  }

  // Convert to markdown
  let markdown = td.turndown($content.html() || '');
  // Collapse 3+ blank lines
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  const t = Number(article.time);
  const date = (t && !isNaN(t)) ? new Date(t * 1000).toISOString() : new Date('1970-01-02').toISOString();

  const fm = frontmatter({
    title: pageTitle,
    slug,
    description: article.digest || '',
    date,
    image: coverLocal,
    categories: ['公众号'],
    tags: [],
    original_url: article.url,
  });

  writeFileSync(indexFile, fm + markdown + '\n');
  return { ok: true, slug, images: urlToLocal.size };
}

async function main() {
  const articles = JSON.parse(readFileSync(jsonPath, 'utf8'));

  // Build url → slug map for ALL articles (deterministic, conflict-free)
  const taken = new Set();
  const slugMap = new Map();
  for (const a of articles) {
    slugMap.set(a.url, uniqueSlug(slugifyArticle(a), taken));
  }

  const slice = articles.slice(start, start + limit === Infinity ? undefined : start + limit);
  console.log(`importing ${slice.length} articles (start=${start}, total available=${articles.length})`);

  let ok = 0, fail = 0, skip = 0;
  for (let i = 0; i < slice.length; i++) {
    try {
      const r = await importArticle(slice[i], i, slice.length, slugMap);
      if (r?.skipped) skip++;
      else if (r?.ok) ok++;
      else fail++;
    } catch (e) {
      console.error(`  ! ${e.message}`);
      fail++;
    }
    // 限速,避免被 ban
    await new Promise((r) => setTimeout(r, 800));
  }
  console.log(`\ndone. ok=${ok} skip=${skip} fail=${fail}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
