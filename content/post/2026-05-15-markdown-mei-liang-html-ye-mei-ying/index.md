---
title: "Markdown 没凉，HTML 也没赢"
slug: 2026-05-15-markdown-mei-liang-html-ye-mei-ying
description: ""
date: 2026-05-15T05:00:00.000Z
image: 
original_url: 
categories:
  - AI
tags:
  - Markdown
  - HTML
  - Claude Code
  - Anthropic
  - 工程实践
---
Anthropic Claude Code 团队的工程师 Thariq Shihipar 这周在 X 上发了一篇文章,说 AI 输出应该用 HTML 替代 Markdown。1143 万阅读,1.5 万点赞。我认真读完了原帖,得出的结论是,这套主张的姿态不对。

不是 HTML 不好。HTML 在它的位置上很好。错的是 Thariq 用了「替代」这个词。Markdown 是 source format,HTML 是 view format。让 view format 替代 source format,是这场争论里最大的概念混淆。

文章里他给了 6 条理由。如果你把每条放进真实工程场景过一遍,会看到哪些站得住、哪些站不住、哪些其实根本没在跟 Markdown 比。

## 两个格式各自是怎么来的,得先讲清楚

Markdown 是 John Gruber 2004 年的产物。设计初衷只有一行字。让纯文本看起来像它已经被排版过。Gruber 当时是个博主,他写文章用纯文本最舒服,但他的读者读起来要带格式。他做了一个 9KB 的 Perl 脚本,把井号变成标题,把星号变成粗体,让一段纯文本同时满足「写起来快」和「读起来好看」。Markdown 的所有边界都是这条约束的延伸。不能写 SVG,不能跑 JS,不能加 CSS。因为这些一旦加进来,纯文本看起来就不像纯文本了。

但 Gruber 原始定义里还留了一个口子。Markdown 没覆盖到的 markup,可以直接用 HTML 标签写。也就是说从设计第一天起,Markdown 跟 HTML 就不是替代关系,是嵌套关系。

HTML 是 Tim Berners-Lee 1990 年的产物。它的设计初衷也只有一行字。让任何文档可以指向任何文档。它从一开始就不是给人写的,是给浏览器渲染的。它的所有结构都是为了让一个文档能跳到另一个文档,能在网络上传递,能被任何客户端渲染。

这两个工具解决的是不同问题。它们能各自活几十年,是因为它们解决的问题没消失。让 Markdown 替代 HTML 是错的,反过来也一样。这一点 Thariq 在文章里没讲清楚,他默认两者是同一个格式品类的两个选项,所以才有「替代」一说。

## 6 条论据

### 论据 1,信息密度(Information Density)

Thariq 说 HTML 能搞 tables、CSS、SVG、JS、绝对定位,Markdown 只能搞 ASCII 图。

这条要分两层看。

机器层(源文件、git 提交、AI 二次读取),HTML 不是信息密度更高,是字符更多。让 Claude Code 写一份 API 接口设计,Markdown 是表格三列加一行表头六个 cell。同样的内容输出 HTML,是 table、thead、tbody、tr、th、td 一层套一层 12 个嵌套标签。两段表达的是完全同样的信息,字符数 HTML 多 30-50%。

人类层(浏览器渲染后的视觉界面),HTML 优势是真实的。SVG 图、交互组件、页内导航能让一份 dashboard 或 review 报告的认知路径变短。这条 Thariq 没错。

问题在 Thariq 把这两层合成一层讲,把「HTML 在人类层信息密度高」推广成「HTML 替代 Markdown」。前者是真的,后者是过度外推。

### 论据 2,100 行 Markdown 没人读

这条事实部分成立,确实有人读不动 100 行 Markdown。但「读不动」的原因是长度,不是格式。同样的内容写成 HTML,800 行没人读得动的概率反而更高,因为 HTML 的视觉层级是渲染后才生效的,源文件读起来比 Markdown 更难。

Thariq 可能真正想说的是「HTML 渲染后比 Markdown 渲染后更易读」。但这跟「Markdown 不行」是两回事。GitHub 上几十万 star 的开源项目 README 全是 Markdown 渲染的,没人觉得读不下去。VS Code 内置 Markdown preview,IDEA 内置,Cursor 也内置。Markdown 渲染早就不是问题。

### 论据 3,分享靠 hosting

Thariq 说 HTML 上传到 S3 就能分享链接,Markdown 不行。

这条要看接收者是谁。

接收者是协作者(需要后续编辑、合并、引用),Markdown 完胜。一个 .md 文件直接发到群里、邮件、GitHub Issue、Notion,对方打开就能改。

接收者是读者(只看不改),HTML 也行。自包含的 single-file HTML 不需要 hosting,直接发邮件丢群本地浏览器打开就能渲染。

更准确的说法,Markdown 适合协作者之间传递可编辑文本,HTML 适合读者之间传递可打开界面。分享本身没有谁单边胜利。

Thariq 真正想说的是「成品物分享 HTML 更好」,这点同意。错的是他把成品物场景的优势推广成「Markdown 不行」。

### 论据 4,HTML 能做交互

Thariq 举了个例子。你让 AI 帮你设计一个登录页,AI 给你一个 HTML 文件,里面嵌了几个滑块,分别控制按钮颜色、字号、圆角。你在浏览器里拖滑块,登录页实时变样。调到满意了,HTML 里有个按钮把你刚才所有的改动整理成一段新指令,你复制这段指令粘回 Claude Code,AI 按这套参数重新出一份最终代码。

这种低维参数调整是过度工程。99% 的场景,「按钮颜色改深蓝,字号 16 改 18,圆角 8 改 12」比「打开网页拖三个滑块再复制配置粘回来」快至少 10 倍。

但 HTML 交互的真实价值不在低维调参。在另外几种场景里它确实比 Markdown 强:PR review dashboard 按风险等级筛选、需求池 triage 拖拽优先级、性能分析报告点开火焰图、prompt tuning 批量比较输入输出评分、架构方案评审 A/B/C 横向对比。这些是高维比较、批注、分组、状态管理,自然语言一句话搞不定。

更准确的边界,低维修改自然语言最快,高维交互场景 HTML 才开始有工程价值。Thariq 错的是他没把这个边界画出来,把 dashboard 场景的优势说成了所有场景的优势。

### 论据 5,数据集成

Thariq 说 Claude Code 比 Claude.ai 强是因为能读代码仓库、MCP、git history。

这条直接跑题。读上下文的能力跟输出格式选择没关系。同一个 Claude Code,输出 Markdown 还是 HTML 跟它能不能读 git history 没有关系。Thariq 把「产品选择」和「格式选择」混在一起讲,是为了把 Claude Code 的优势挂到 HTML 上。

### 论据 6,It's Joyful

「写 HTML 文档更有创作感」。

审美偏好不是工程论据。手搓 Vim 配置也有创作感,写 zsh 主题也有创作感。这些都是真实感受,但工具选择不是看用起来开不开心,是看链路成本和长期成本。

## Token 经济学这条要补一刀

Simon Willison 在博客里还呼应了一下。他说自己从 GPT-4 时代起一直默认 Markdown,因为 8K 上下文里 Markdown 比 HTML 省 token。但现在 1M 上下文了,这个考虑不重要了。

这条半对半错。单次调用里 HTML 多花的 token 可以忽略,没错。但累计成本不行。

HTML 比 Markdown 多 30-50% token,这是结构性差异。一个工程师一天用 Claude Code 200 次,多花的 token 一年下来按 API 价格能换几台 MacBook Pro。Anthropic 自家工程师用着不要钱的内部额度,自然觉得 token 经济学过时了。外部用户看到的是真金白银。

Uber 这周也出了新闻。CTO 报告说 Uber 2026 年的 AI 工具预算在 4 个月里烧掉了 2400 万美元,95% 工程师用 AI coding tools,70% 新代码 AI 生成,每人月成本 500-2000 美元。1M 上下文不代表 token 不要钱,恰恰相反,token 烧得更快。

但这个累计成本只对「HTML 进入工程链路被反复读取」的场景成立。如果 HTML 只是一次性 artifact,生成完给人看一眼即丢、不进 AI 二次读取链路,token 成本是单次的,Simon Willison 那条逻辑就成立。

## source 和 view 的分界

到这里要把 Thariq 文章里没区分的两个场景拆开。

HTML 作为 source。把 HTML 文件直接放进 git 仓库,作为长期维护的 source of truth。这种场景下 HTML 输给 Markdown 在 4 条上。

版本控制。git diff 一个 Markdown 文件,一行就是一行内容,改哪段标题、哪条列表项一目了然。HTML 不一样,一段内容容易跨几行嵌套标签,diff 给你的上下文经常是 `</div>、<section>` 这种孤立标签,看不出改的是哪一块。更糟的是 HTML 容易被 Prettier 重排,被 AI 重新生成时属性顺序、缩进、自闭合写法每次都不同,一整个文件 diff 全是红绿,但没一行真改了什么。

AI 二次读取。AI 输出常常被另一个 AI 读取。你让 Claude 生成一份 spec,下一轮让 Codex 按这份 spec 改代码。HTML 多花的 30-50% token,每次二次消费都在缴这个税。

人工编辑。Thariq 的反驳是「用户不再编辑 AI 输出」。这条对一半。用户不编辑「最终成品物」,但仍然要编辑「中间产物」。改一处 Markdown 是按一下回车,改一处 HTML 是数嵌套层级。HTML 文件用 vim 改一个段落要看 3 行标签结构,效率断崖式下跌。

长期可维护性。这条最容易被误读。自包含静态 HTML 30 年后能不能打开?能,HTML 本身就是 Web 的核心标记语言,标准向后兼容做得很好。真正的问题不是「打不开」,是「不适合作为长期可维护源文件」。一份 HTML 文档过几年大概率会被换 CSS framework、换 CDN、换 polyfill,每次都是一次格式漂移。而 .md 文件 30 年后还能 grep、还能 diff、还能用任何文本编辑器打开,可维护性是另一个维度的事。

HTML 作为 artifact。一次性渲染、给人看完即丢、不进 git、不被 AI 二次读取、不被人工编辑。这种场景下 HTML 是真有优势。Claude.ai 的 artifact 是 HTML,设计稿是 HTML,Thariq 文章里的 dashboard 是 HTML,都没问题。

Thariq 主张的是 artifact 模式。他文章后半部分写「don't need to do much, just ask for HTML artifact」,暗示了一次性视图路径。但他用了「替代 Markdown」这个表述,把 artifact 优势说成了 source 替代。这是文章里错的地方。

## 真实工程的三层模型

现实里更可能的答案不是 Markdown or HTML,是这样的三层。

Markdown as source。spec、注释、commit message、内部文档、给 AI 二次读取的 brief。这些场景 Markdown 没有替代品。

HTML islands for rich blocks。Markdown 文档里嵌入的表格、图表、可视化代码块,Gruber 原始设计就留了这个口子。需要表达力强的地方,直接嵌一段 HTML。

HTML artifact for final view。给客户看的 dashboard、PR review report、设计稿。这一层 Thariq 没错,HTML 比 Markdown 强。

三层各自有自己的最优场景。Thariq 想推的第三层是有价值的,但前两层 Markdown 没有替代品。把第三层的优势包装成「HTML 替代 Markdown」,是把局部结论当成了全局结论。

最后我想说，一个工具能活几十年,往往不是因为它没缺点。是因为它的缺点本身就是它的设计。。Markdown 会继续是程序员日常的中间产物,HTML 会继续是给人看的成品物。两个工具各自安好，不可替代。