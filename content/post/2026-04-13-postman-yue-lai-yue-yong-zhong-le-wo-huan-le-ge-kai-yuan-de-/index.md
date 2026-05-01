---
title: "Postman 越来越臃肿了，我换了个开源的，还能让 AI 帮我写测试"
slug: 2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-
description: "Postman 我用了好几年了。从最早的 Chrome 插件时代开始用的，那时候它还是个轻量小工具，打开就能测接口，干干净净。"
date: 2026-04-13T03:56:46.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/cover.jpg
original_url: https://mp.weixin.qq.com/s/2GA0rGmcyMH5lf_dt3aS4Q
categories:
  - 工具与效率
tags:
  - Git
---
Postman 我用了好几年了。

从最早的 Chrome 插件时代开始用的，那时候它还是个轻量小工具，打开就能测接口，干干净净。但最近这两年，怎么说呢，它开始「端着」了。

打开就让我登录。不登录不让用。

好不容易登录了，又弹窗让我升级 Team 版。

集合还给我存到云端去了。我就测个本地接口，你把我的请求数据往你服务器上传干嘛？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/001-293772cd.png)

我一直忍着，直到有一天，团队里两个人同时改了同一个集合，Postman 云同步直接给合并冲突了，还没法像 Git 那样 diff 看变更。那天我就想，不行了，得换。

然后我遇到了 Bruno。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/002-67da7d91.png)

怎么形容呢，就像你一直在用一个越来越臃肿的 IDE，突然有人递给你一个 Vim，告诉你「够用了，而且是你的」。

Bruno 干了一件特别简单但特别对的事情，它把你的 API 请求存成 .bru 文件，放在你本地文件夹里。

就是普通的文本文件，打开长这样。

```
meta {  name: 用户登录  type: http  seq: 1}post {  url: {{baseUrl}}/auth/login  body: json  auth: none}headers {  Content-Type: application/json}body:json {  {    "username": "{{username}}",    "password": "{{password}}",    "expiresInMins": 30  }}script:post-response {  if (res.status === 200) {    bru.setVar("authToken", res.body.accessToken);    bru.setVar("userId", res.body.id);  }}tests {  test("登录应该返回 200", function() {    expect(res.status).to.equal(200);  });  test("响应中应该包含 accessToken", function() {    expect(res.body.accessToken).to.be.a("string");    expect(res.body.accessToken.length).to.be.greaterThan(0);  });  test("响应中应该包含用户基本信息", function() {    expect(res.body.id).to.be.a("number");    expect(res.body.username).to.equal("emilys");    expect(res.body.email).to.be.a("string");  });  test("响应时间应该小于 3 秒", function() {    expect(res.responseTime).to.be.lessThan(3000);  });}

```

你看，GET 请求、Header、Body、断言，全都是纯文本。你用任何编辑器都能打开它，改完保存就行。

这玩意最不同的地方在哪？

**它可以用 Git 管理。**

以前团队共享 Postman 集合，那叫一个痛苦。谁改了什么不知道，版本对不对不确定，冲突了还没法 resolve。

现在用 Bruno，接口定义就是文件，扔进 Git 仓库，该 PR 就 PR，该 Code Review 就 Code Review。有人改了某个接口的 Header，diff 里看得一清二楚。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/003-c38b66fd.png)

用程序员已经会的工具，解决程序员的问题。不用学新的协作方式，不用付费，不用担心数据被传到哪个云上。

Bruno 官网上有一句话我印象特别深，大意是**「我们不会同步你的任何数据到云端，甚至连登录的概念都没有。我们看不到你在 Bruno 里输入了什么，也不会用你的数据训练任何 AI 模型」。**

在这个年代，一个工具敢这么说，我觉得还是挺硬气的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/004-2762e255.png)

回到工具本身。说到这里，可能有朋友会想，开源 API 客户端一抓一大把，Insomnia、Hoppscotch、Thunder Client，凭什么是 Bruno？

我自己用下来，让我有「这玩意不一样」的瞬间，是发现它有 CLI。

但我说的不是「能在终端里跑测试」这种废话。Newman 也能跑，Postman 自己也有命令行。我说的是另一件事。

**Bruno 的 CLI，让 Claude Code 和 Cursor 这种 AI 编程工具，第一次能真正帮你写和跑接口测试。**

这话有点大，我用两件刚发生的真事讲一下。

回到 Bruno 的 CLI 本身。装它就一行，

```bash
npm i -g @usebruno/cli

```

装完之后命令叫 `bru`，跑整个集合的测试是这样，

```
bru run --env production

```

输出长这样。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/005-95a75ce3.png)

干净、彩色、有 ✓ 和 ✗、有总耗时、有失败原因。最重要的是，**这是一段普通的终端命令，输出是普通的文本**。

为什么这件事重要？因为这两个特征，正好是 AI 编程 agent 工作的边界。

Claude Code、Cursor、Codex 这些工具，它们能干什么？它们能读你的代码文件，能写新的文件，能在终端里跑命令，能读命令的输出。它们不能干什么？它们不能点击 Postman 的按钮，不能在你 GUI 里输入 token，不能登录任何账号。(**或者说不方便，成本高，效率低**)

Postman 的核心数据存在云端、操作靠 GUI、协作靠登录，这三件事每一件都把 AI agent 挡在外面。

而 Bruno 的核心数据是 .bru 文本文件、操作靠 CLI、协作靠 Git。每一件都正好是 AI 最擅长的那种事。

抽象的说完了，说点具体的。

我前两天就让 Claude Code 帮我加了一个测试，过程是这样的。

我跟它说，「我刚加了一个搜索商品的接口，帮我在 bruno 集合里加个测试用例」。

它干了三件事，全程没问我任何问题。

第一步，读了我现有的一个 .bru 文件，就是为了搞清楚我用的格式。比如我习惯加哪些 test，断言风格是什么样的。

第二步，照着这个格式写了一个新的 06-搜索商品.bru 文件，放在我集合的根目录里。请求方法、URL、query 参数、4 条断言，全都给我加上了。

第三步，它直接执行 `bru run 06-搜索商品.bru --env production`，亲眼看着 4 个测试全绿，然后才回我一句「写完了，4/4 通过」。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/006-f94498cf.png)

整个过程我没碰 Bruno 的 GUI，没敲一个字符的代码，没解释什么是 .bru 格式。AI 自己读自己写自己跑自己验证。

你可能会问，这个事换成 Postman 不行吗？

我得先把话说清楚，Postman 不是没有 CLI。Newman 一直都在，Postman Collection 也是 JSON 文件，AI 理论上能读能写。这条路是通的。

但你真去试一下就会发现，那条路上全是石头。

Postman 的 Collection JSON 格式不是给人手写的。我做了个最朴素的对比，同一个 GET 请求加一条「状态码等于 200」的断言，写成 .bru 是 15 行，导出成 Postman Collection JSON 是 44 行。区别在哪？.bru 里 URL 就是一个字符串 `https://api.example.com/users`，Postman JSON 里 URL 被拆成 `protocol`、`host` 数组、`path` 数组三个字段。.bru 里测试代码就是普通 JS，Postman JSON 里测试代码以字符串数组的形式塞在 event 里，每一行 JS 都得加引号、转义、再 JSON 序列化一次。还有一堆 `_postman_id`、`_exporter_id`、`schema` 这种内部元数据，跟你的业务接口毫无关系，但你不写就报错。

让 AI 写 .bru，它跟写 markdown 一样轻松。让 AI 写 Postman JSON，它更像在翻译一份配置文件，token 烧得多，出错概率高，写完你自己 review 都费劲，git diff 出来三行业务变更夹在二十行格式噪音里。

所以不是 AI 不能写 Postman 的测试，是 Postman 的格式从一开始就没打算让人手写，更没打算让 AI 直接读写。它假设你有一个 GUI 在中间帮你管理这些内部细节。AI 进来之后，那个假设就有点尴尬了。

我说的还不是最炸的场景。

**真正让我觉得 Bruno + AI 是 1 + 1 大于 10 的，是调试场景。**

我又试了一次，让 Claude Code 帮我加一个购物车接口的测试。它写完跑了一遍，挂了。

错误信息是这样的。

```
✕ 购物车应该有 totalPrice 字段   expected undefined to be a number✕ 购物车应该有 products 数组   expected undefined to be an array

```bash

它猜错了字段名。这种事很正常，毕竟它没真的去看接口返回。但接下来才有意思。

它没有问我、没有让我提供文档、也没有放弃。它自己执行了一条 curl 命令，把购物车接口的真实响应拉了下来。

```bash
curl -s https://dummyjson.com/carts/1

```

看到响应里字段是 `total` 和 `products`，不是 `totalPrice` 和 `items`。它马上把测试里的字段名改了，再跑一遍，全绿。

整个调试过程，我做了什么？我什么也没做。我只是看着它一步一步跑完。

这就是 Bruno + CLI + AI 的真正价值。你的 API 测试不再是一个孤立的、需要你手动维护的负担，而是变成了 AI 可以读、可以写、可以跑、可以调试的一种代码。

它和你的源码、你的 Git 历史、你的 CI/CD、你的 AI agent，全都是一体的。

写到这里我猜有人要拍桌子了。

**「等等，国内程序员谁还用 Postman 啊？Apifox 它不香吗？」**

发，我们专门聊聊 Apifox。

我必须先承认它真的很强。一体化平台，API 文档、调试、Mock、自动化测试、团队协作全在一个工具里搞定，相当于 Postman + Swagger + JMeter 三合一。界面是中文，文档是中文，国内团队几乎零学习成本。如果你的团队 20 人以上，需要权限管理、需要实时协作、需要统一的 API 文档管理，Apifox 是比 Bruno 更合适的选择。这点我不否认。

而且 Apifox 不傻，它也在跟上 AI 浪潮。它有 apifox-cli，能在终端里跑测试场景。它甚至专门做了 Apifox MCP Server，可以让 Cursor 和 Claude Desktop 读取 Apifox 项目里的 API 文档，帮你写代码。

那问题来了，Bruno 和 Apifox 在 AI 这件事上到底有啥不一样？

我读了一圈 Apifox 的官方文档，发现一个挺有意思的差别。

**Apifox 接 AI 的方式，是让 AI 来连接 Apifox。Bruno 接 AI 的方式，是 Bruno 根本就是 AI 已经会读的格式。**

具体说，Apifox 的 AI 工作流是这样的，你的测试数据躺在 Apifox 云端项目里，你装一个 Apifox MCP Server，配置 Cursor 去连这个 MCP，AI 通过 MCP 协议向 Apifox 服务发请求，把 API 文档拿下来，再帮你生成代码。

Bruno 的 AI 工作流是这样的，你的测试就是项目目录里的 .bru 文件，AI 直接 cat、edit、bru run。完了。

你看出区别了吗？Apifox 把 AI 当成一个外部工具来对接，所以需要 MCP 这一层中转。而 Bruno 根本不需要 MCP，因为它跟 AI 用的是同一种原生语言：**文本文件加终端命令。**

还有一个更现实的差别。Apifox 的 MCP Server 现在的能力，是让 AI 读取 API 文档来生成代码，它并不能让 AI 直接去编辑你的测试用例。AI 在 Apifox 这边的角色基本上是只读的。

而我前面演示的那两个场景，Claude Code 帮我写新测试、自动调试、修字段名，那是完整的读写跑改循环。AI 不光在读，还在写，还在跑，还在调试。这是因为 .bru 是普通文件，Edit 工具就能改，Bash 工具就能跑。它中间没有任何一层，所以也没有任何一层会卡住。

这不是说 Apifox 不好，是两条不同的路。Apifox 选的是「我是平台，AI 来连我」，Bruno 选的是「我什么都不是，我就是文件」。前者适合企业级场景，后者适合代码即测试的开发者工作流。

我自己是后者。我喜欢我所有的东西都能塞进 Git 仓库，喜欢 AI 直接读我硬盘上的文件，不喜欢任何账号、登录、云端中转。所以我选 Bruno。

如果你的工作场景更接近企业级 SaaS 那一套，那 Apifox 完全没问题，甚至更合适。但如果你跟我一样，希望让 AI 一句话把接口测试搞定，那 Bruno 这条路确实更顺。

聊完 Apifox 我们继续。顺便提一下 CI 集成，因为这块也很丝滑。Bruno CLI 支持输出 JUnit XML，GitHub Actions、GitLab CI、Jenkins 直接吃这个格式。我的工作流文件大概长这样。

```
- name: 安装 Bruno CLI  run: npm install -g @usebruno/cli- name: 跑接口测试  run: bru run --env production --reporter-junit junit.xml

```

两步。你的 PR 一提交，所有接口测试自动跑一遍，挂了直接拒绝合并。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/007-56b53ed9.png)

生成的测试执行也挺好看的

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/008-cc895180.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-13-postman-yue-lai-yue-yong-zhong-le-wo-huan-le-ge-kai-yuan-de-/009-90333e8c.png)

整套东西免费、开源、本地、Git 友好、AI 友好，不用登录、不用付钱、不用担心数据上云。

安装很简单。桌面版，

```bash
brew install bruno

```bash

CLI，

```bash
npm i -g @usebruno/cli

```

用了一周之后我把 Postman 卸了。

不是它不好，是我不再需要一个登录才能用、集合存在别人云上、免费版各种限制、AI 完全帮不上忙的接口测试工具了。

我只需要一个文件夹、几个 .bru 文件、一条终端命令，和一个能读懂这一切的 AI。

有时候工具的进步不是功能越加越多，而是把不该有的东西去掉。Bruno 去掉了登录、去掉了云端、去掉了 GUI 锁定，剩下的全是程序员真正需要的东西。

而当你把这些不需要的东西去掉之后，你会发现一个意外的副作用，AI 进来了。

好了就说这么多。

如果你也受够了 Postman，试试 Bruno。说不定你也会像我一样，用完就回不去了。

ps:我写的 demo 在这里，你可以拉下来试一下，可以 run 的 ：https://github.com/xiaobox/bruno-demo
