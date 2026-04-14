#!/usr/bin/env node
// 基于关键词规则,扫描每篇文章的标题+正文,自动生成 category(单一大类) + tags(多个细标签),
// 重写 frontmatter。
//
// 用法:
//   node scripts/auto-tag.mjs [--dry]

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve } from 'path';

const POSTS = 'content/post';
const DRY = process.argv.includes('--dry');

// Category 规则: 用打分制。每条 cat 有多个关键词(各自正则),
// 标题命中 ×5,正文命中 ×1。最高分的 cat 胜出。
// 关键词要选具有强分类信号的(避免歧义)。
const CATEGORY_KEYWORDS = {
  'AI': [
    /大模型/i, /\bllm\b/i, /\bgpt\b/i, /chatgpt/i, /\bclaude\b/i, /\bcursor\b/i, /copilot/i,
    /codex/i, /\brag\b/i, /\bagent\b/i, /智能体/i, /提示词/i, /\bprompt\b/i, /deepseek/i,
    /\bgemini\b/i, /sora\d?/i, /midjourney/i, /stable\s*diffusion/i, /文生图/i, /人工智能/i,
    /embedding/i, /rerank/i, /tinybert/i, /qwen/i, /\bllama\b/i, /\bmcp\b/i, /langchain/i,
    /langgraph/i, /llamaindex/i, /ollama/i, /anythingllm/i, /maxkb/i, /ragflow/i,
    /vibe\s*coding/i, /moonshot/i, /\bkimi\b/i, /文心一言/i, /vllm/i, /knative.*ai/i,
    /推理.*平台/i, /模型.*服务/i,
  ],
  '云原生': [
    /\bkubernetes\b/i, /\bk8s\b/i, /\bdocker\b/i, /\bistio\b/i, /service\s*mesh/i,
    /kserve/i, /knative/i, /\bhelm\b/i, /prometheus/i, /grafana/i, /skywalking/i,
    /argo/i, /sidecar/i, /微服务/i, /spring\s*cloud/i, /\bdubbo\b/i, /sentinel/i,
    /\bnacos\b/i, /seata/i, /apisix/i, /higress/i, /finops/i, /可观测/i,
    /cloud\s*native/i, /云原生/i, /\bgateway\b/i, /\bgke\b/i, /\beks\b/i,
  ],
  '数据库': [
    /\bmysql\b/i, /postgres/i, /\bredis\b/i, /mongodb/i, /sqlite/i, /分库分表/i,
    /sharding/i, /innodb/i, /sql\s*优化/i, /数据库索引/i, /数据库事务/i,
    /elasticsearch/i, /向量数据库/i, /milvus/i, /\bdba\b/i, /\borm\b/i, /shardingsphere/i,
  ],
  '中间件': [
    /rocketmq/i, /\bkafka\b/i, /消息队列/i, /\bmq\b/i, /rabbitmq/i, /zookeeper/i,
  ],
  '后端': [
    /\bjava\b/i, /\bjvm\b/i, /\bspring\b/i, /\btomcat\b/i, /mybatis/i, /hibernate/i,
    /\bnetty\b/i, /多线程/i, /并发/i, /线程池/i, /\baqs\b/i, /completablefuture/i,
    /\bjdk\b/i, /\bjit\b/i, /\bgc\b/i, /垃圾回收/i, /threadlocal/i, /\bjpa\b/i,
    /java\s*io/i, /\bnio\b/i, /\bjuc\b/i, /反射/i, /注解/i,
  ],
  '系统底层': [
    /\blinux\b/i, /\bnginx\b/i, /\btcp\b/i, /\bhttp\b/i, /网络协议/i, /内核/i,
    /进程/i, /信号/i, /文件系统/i, /epoll/i, /操作系统/i, /systemd/i, /寄存器/i,
    /\bcpu\b/i, /汇编/i, /\biptables\b/i, /\biostat\b/i,
  ],
  '工具与效率': [
    /\bmacos\b/i, /\bmac\b/i, /vscode/i, /\bvim\b/i, /\bemacs\b/i, /\bchrome\b/i,
    /terminal/i, /命令行/i, /\bcli\b/i, /\bgit\b/i, /\bhugo\b/i, /\bmarkdown\b/i,
    /alfred/i, /raycast/i, /notion/i, /obsidian/i, /tmux/i, /\bwarp\b/i, /iterm/i,
    /\bzsh\b/i, /\bbash\b/i, /\bbrew\b/i,
  ],
  '架构与方法': [
    /架构师/i, /\bddd\b/i, /领域驱动/i, /设计模式/i, /事件驱动/i, /\beda\b/i,
    /架构演进/i, /重构/i, /架构.*实践/i,
  ],
  '行业与思考': [
    /求职/i, /面试/i, /管理/i, /职场/i, /裁员/i, /创业/i, /读书/i, /周报/i,
    /年终总结/i, /绩效/i, /\bokr\b/i, /\bkpi\b/i, /\b996\b/i, /大厂/i,
    /跳槽/i, /涨薪/i, /独立开发/i, /独立思考/i, /阿里/i, /字节/i, /腾讯/i,
  ],
};

function scoreCategory(title, body) {
  const titleLower = title;
  const bodyLower = body.slice(0, 3000);
  const scores = {};
  for (const [cat, patterns] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const re of patterns) {
      if (re.test(titleLower)) score += 5;
      const m = bodyLower.match(re);
      if (m) score += 1;
    }
    if (score > 0) scores[cat] = score;
  }
  if (!Object.keys(scores).length) return '杂谈';
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

// Tag 规则: 所有命中的 tag 都加上(多个)。
const TAG_RULES = [
  // 编程语言
  ['Java', /\bjava\b/i],
  ['JVM', /\bjvm\b|\bgc\b|垃圾回收|\bjit\b/i],
  ['Python', /\bpython\b/i],
  ['Go', /\bgolang\b|\bgo\s*语言/i],
  ['JavaScript', /\bjavascript\b|nodejs|node\.js/i],
  ['TypeScript', /\btypescript\b/i],
  ['Rust', /\brust\b/i],
  // 框架
  ['Spring', /\bspring\b/i],
  ['Dubbo', /\bdubbo\b/i],
  ['Netty', /\bnetty\b/i],
  // 数据库
  ['MySQL', /\bmysql\b/i],
  ['PostgreSQL', /\bpostgres/i],
  ['Redis', /\bredis\b/i],
  ['MongoDB', /\bmongodb\b/i],
  ['Milvus', /\bmilvus\b/i],
  // 中间件
  ['Kafka', /\bkafka\b/i],
  ['RocketMQ', /rocketmq/i],
  ['Nacos', /\bnacos\b/i],
  ['ZooKeeper', /\bzookeeper\b/i],
  // 云原生
  ['Kubernetes', /\bkubernetes\b|\bk8s\b/i],
  ['Docker', /\bdocker\b|容器/i],
  ['Istio', /\bistio\b|service\s*mesh/i],
  ['KServe', /\bkserve\b/i],
  ['vLLM', /\bvllm\b/i],
  // 系统/工具
  ['Linux', /\blinux\b/i],
  ['Nginx', /\bnginx\b/i],
  ['macOS', /\bmacos\b|\bmac\b/i],
  ['Git', /\bgit\b/i],
  ['Vim', /\bvim\b/i],
  ['VSCode', /\bvscode\b|visual\s*studio\s*code/i],
  ['Chrome', /\bchrome\b/i],
  ['Hugo', /\bhugo\b/i],
  // AI
  ['LLM', /\bllm\b|大模型/i],
  ['ChatGPT', /chatgpt|\bgpt[-\s]?[34]/i],
  ['Claude', /\bclaude\b/i],
  ['Cursor', /\bcursor\b/i],
  ['Codex', /\bcodex\b/i],
  ['RAG', /\brag\b/i],
  ['Agent', /\bagent\b|智能体/i],
  ['Prompt', /提示词|\bprompt\b/i],
  ['DeepSeek', /deepseek/i],
  ['Gemini', /\bgemini\b/i],
  ['MCP', /\bmcp\b/i],
  ['LangChain', /langchain/i],
  ['Embedding', /embedding|向量/i],
  // 概念
  ['缓存', /缓存|\bcache\b/i],
  ['性能优化', /性能优化|性能调优|\bp99\b|\bp90\b|\btps\b/i],
  ['算法', /算法/i],
  ['数据结构', /数据结构|链表|二叉树|hashmap|b\+\s*tree/i],
  ['设计模式', /设计模式/i],
  ['面试', /面试/i],
  ['微服务', /微服务/i],
  ['架构', /架构/i],
  ['多线程', /多线程|并发|线程池|\baqs\b/i],
  ['网络', /\btcp\b|\bhttp\b|网络协议|epoll/i],
  ['DevOps', /\bdevops\b|\bci\/cd\b|\bci\b|\bcd\b/i],
];

function parseFM(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

function classify(title, body) {
  const category = scoreCategory(title, body);
  const text = (title + '\n' + body).slice(0, 3000);
  const tags = [];
  for (const [tag, re] of TAG_RULES) {
    if (re.test(text)) tags.push(tag);
  }
  return { category, tags: tags.slice(0, 8) };
}

const dirs = readdirSync(POSTS).filter((d) => statSync(resolve(POSTS, d)).isDirectory());
const stats = { total: 0, modified: 0, byCategory: {}, tagCount: {} };

for (const dir of dirs) {
  const idx = resolve(POSTS, dir, 'index.md');
  let md;
  try { md = readFileSync(idx, 'utf8'); } catch { continue; }
  const parsed = parseFM(md);
  if (!parsed) continue;
  stats.total++;

  // 提取 title
  const titleMatch = parsed.fm.match(/^title:\s*"?(.*?)"?\s*$/m);
  const title = titleMatch ? titleMatch[1] : '';

  const { category, tags } = classify(title, parsed.body);

  stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  for (const t of tags) stats.tagCount[t] = (stats.tagCount[t] || 0) + 1;

  // 重写 frontmatter: 按行扫描,跳过现有 categories/tags 块及孤立缩进行
  const lines = parsed.fm.split('\n');
  const kept = [];
  let skip = false;
  for (const line of lines) {
    // 顶层字段(不缩进)开始一个新 block
    if (/^[A-Za-z_]/.test(line)) {
      const key = line.match(/^(\w+):/)?.[1];
      if (key === 'categories' || key === 'tags') {
        skip = true;
        continue;
      }
      skip = false;
      kept.push(line);
      continue;
    }
    // 缩进行: 当前如果在 skip 模式则跳过,否则保留(其实不该有孤立缩进)
    if (skip) continue;
    // 跳过孤立的 yaml 列表项(像 "  - xxx" 但前面没有 key)
    if (/^\s+-\s/.test(line)) continue;
    kept.push(line);
  }
  let newFm = kept.join('\n').replace(/\n+$/, '');

  // 追加新的 categories 和 tags
  const catBlock = `categories:\n  - ${category}`;
  const tagBlock = tags.length ? `tags:\n${tags.map((t) => `  - ${t}`).join('\n')}` : '';

  newFm = `${newFm}\n${catBlock}${tagBlock ? '\n' + tagBlock : ''}`;

  const newMd = `---\n${newFm}\n---\n${parsed.body}`;
  if (newMd !== md) {
    stats.modified++;
    if (!DRY) writeFileSync(idx, newMd);
  }
}

console.log(`scanned ${stats.total} posts, modified ${stats.modified}${DRY ? ' (dry)' : ''}`);
console.log('\n--- categories ---');
Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
console.log('\n--- top tags ---');
Object.entries(stats.tagCount).sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));
