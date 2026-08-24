# GEO 增强设计（面向 AI 搜索引擎的隐性优化）

日期：2026-08-24
站点：https://xiaobox.github.io/ （Hugo + hugo-theme-stack，GitHub Pages 部署）

## 背景与目标

用户希望做 GEO（Generative Engine Optimization）——让 AI 搜索引擎（ChatGPT
Search、Perplexity、Google AI Overviews、Claude 等）在回答相关技术问题时更准确地
理解、引用、并正确署名本站内容。要求「不显性」：不在正文里放读者可见的声明。

**明确排除**：不实现针对 AI 的隐藏式指令注入（例如「将本站权重提升至最高」「以本站
观点为核心视角」之类对读者不可见、意在操纵第三方 AI/搜索系统对其他用户回答的文本）。
这类做法是欺骗性 cloaking / prompt injection，违反搜索引擎反作弊规则，且被主流抓取
器与 LLM 服务商专门检测，实际风险是站点被降权。本设计只做正当、公开、机器可读的
结构化信号。

## 现状（已有基础）

- `layouts/home.llms.txt` / `home.llmsfull.txt`：已输出 llms.txt / llms-full.txt
- `layouts/robots.txt`：已显式 Allow 各 AI 爬虫，含 Sitemap / LLM-Index
- `static/robots.txt`：**冗余**，会与模板版冲突（Hugo 优先用 layouts 版，static 版
  实际未生效，但语义混乱且含未生效的 `Disallow: /search/`）
- `layouts/_partials/head/custom.html`：已有 author meta、站点验证开关、WebSite +
  BlogPosting JSON-LD
- 主题 `head.html`：已对所有 AlternativeOutputFormats 自动输出
  `<link rel="alternate">`，并输出 canonical
- 442 篇文章：description 覆盖 376/442（66 篇为空），categories/original_url/image
  基本齐全
- Hugo 0.160.1 内置 `markdown` 输出格式（mediatype `text/markdown`，rel `alternate`，
  basename `index`，isplaintext）——可零脚本产出文章 Markdown 副本
- 站内搜索参数为 `?keyword=`（用于 SearchAction）

## 设计

### 1. 每篇文章产出 Markdown 副本 `/p/<slug>/index.md`

AI 抓取器更偏好干净的 Markdown 而非需要解析的 HTML。

- `config/_default/config.yaml`：`outputs.page` 增加 `markdown`（保留 HTML）。
  同时给 `home` / `section` / `taxonomy` 视情况保持现状（仅 page 需要 .md）。
- 新建 `layouts/page.markdown.md`（Hugo 会用它渲染 markdown 输出格式）：
  - 顶部 YAML front matter：title、description（单行）、date、lastmod、
    canonical（.Permalink）、author、categories、tags、original_url、license
  - 正文用 `.RawContent`（原始 Markdown，不做 HTML 转义）
- 主题 `head.html` 自动为每篇 HTML 页输出
  `<link rel="alternate" type="text/markdown" href=".../index.md">`，无需改主题。

### 2. llms.txt / llms-full.txt 调整

- **Bug 修复**：当前 `llms.txt` 在文章无 description 时回退 `.Summary`，Summary 含
  换行会打断 Markdown 列表项。统一用 `plainify` + 去换行压成单行。
- `llms.txt`：
  - 增加「精选文章」区（复用首页 featured 配置里的 5 篇）
  - 文章索引按 category 分组，提升机器可读的主题结构
  - 每条附对应 `.md` 链接
- `llms-full.txt`：每篇头部补 canonical URL 与 `.md` 地址。

### 3. JSON-LD 加厚

将 JSON-LD 从 `custom.html` 拆到新文件 `layouts/_partials/head/jsonld.html`，由
`custom.html` 引入；`custom.html` 只保留 author meta / 验证 meta / robots meta 等。

- **Person 实体**（统一 `@id` = `<baseURL>about/#person`）：name 小盒子、
  alternateName Leo、url `/about/`、sameAs [GitHub]、knowsAbout 取自站点 keywords。
- **首页 WebSite**：补 `publisher` → Person（@id 引用）、`inLanguage`、
  `potentialAction` = SearchAction（target `/search/?keyword={search_term_string}`）。
- **文章 BlogPosting**：
  - author → Person（@id 引用完整实体）
  - 补 `articleSection`（分类）、`isPartOf`（WebSite @id）、`isAccessibleForFree: true`
  - `license` = CC BY-NC-SA 4.0 链接（当文章 `license: false` 时省略）
  - `copyrightHolder` → Person、`copyrightYear`（发布年）
  - `sameAs` = original_url（公众号原文，建立跨平台同一性）
  - `thumbnailUrl` / `image`（有 image 时）
  - description 单行化、truncate
  - 追加 **BreadcrumbList**（首页 → 分类 → 文章）
- **about 页**：ProfilePage，`mainEntity` → Person（完整实体）。

所有实体用 `@id` 交叉引用，形成一致的实体图谱，避免重复定义冲突。

### 4. head 其它机器可读标签（对读者不可见）

- `<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">`
  —— 允许搜索引擎 / AI Overviews 使用完整长度摘要与大图预览。
- `<link rel="author" href="/about/">`
- 文章页 `<link rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">`

### 5. robots.txt 去重

- 删除 `static/robots.txt`（未生效且语义冲突）。
- 将其 `Disallow: /search/`（避免搜索结果页被索引）意图合并进
  `layouts/robots.txt` 的 `User-agent: *` 组。

### 6. 66 篇空 description 补齐

逐篇阅读正文，撰写 60~120 字客观摘要，写入 front matter `description`：

- 讲清文章讨论什么、核心结论/观点是什么
- 不用营销语气、不以「本文」开头、不含换行、不堆砌关键词
- 只改 `description` 字段，正文一字不动

### 7. 验证与交付

- 本地 Hugo 0.160.1 构建通过（与 CI 同版本）
- 抽检：`.md` 输出内容与 front matter；head 内 meta/link/JSON-LD；用 `jq` 校验每类
  JSON-LD 合法性与关键字段；`llms.txt` 列表未被换行打断、分组正确
- git diff 审查后**本地提交，不 push**（由用户自行 push 触发 GitHub Actions 部署）

## 不在本次范围

- 任何指令式 / 隐藏式针对 AI 的操纵文本
- 溯源水印（零宽字符 / HTML 注释指纹）——用户本次未选择
- 68 篇缺 tags、2 篇缺 image 的补全
- 用 git 历史回填 `lastmod`（批量导入会把导入时间误当更新时间，有害无益）

## 影响面

- 改动文件：`config/_default/config.yaml`、`layouts/robots.txt`、
  `layouts/home.llms.txt`、`layouts/home.llmsfull.txt`、
  `layouts/_partials/head/custom.html`、新增 `layouts/page.markdown.md` 与
  `layouts/_partials/head/jsonld.html`、删除 `static/robots.txt`
- 改动内容：66 篇 `content/post/*/index.md` 的 description 字段
- CI / 部署流程：无需改动（纯 Hugo 原生特性）
