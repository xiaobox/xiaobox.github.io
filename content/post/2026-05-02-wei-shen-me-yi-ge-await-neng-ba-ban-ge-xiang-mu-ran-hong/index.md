---
title: "为什么一个 await 能把半个项目染红？"
slug: 2026-05-02-wei-shen-me-yi-ge-await-neng-ba-ban-ge-xiang-mu-ran-hong
description: ""
date: 2026-05-02T06:00:00.000Z
image: 
original_url: 
categories:
  - 后端
---
写过 Python asyncio 的人，应该都见过一个很烦的场景。

你只是想把一个老函数改成异步。

比如以前是 `fetch_user()`，现在里面要请求远程服务，于是你把它改成 `await fetch_user()`。

本来以为也就一行代码的事。

结果呢，调用它的函数要改成 `async def`。再往上，调用方的调用方也要改。一路改到路由层、任务入口、测试用例，最后你盯着 git diff 发现，自己明明只动了一个 I/O 调用，却把半个项目都染红了

这事不是 Python 独有。JavaScript、Rust、Kotlin、Swift，大家都见过。只要一个 `await` 掉进调用链，它就会像红墨水一样往上渗。

这就是经典的 **“async 染色问题”**

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%882%E6%97%A5%2002_07_40.png)

讽刺的是，async/await 当年出现的时候，其实是来解救我们的。

这事儿要从 1976 年讲起。

1976 年的时候，印第安纳大学有两个研究员，Daniel Friedman 和 David Wise，发了一篇论文，标题叫《The Impact of Applicative Programming on Multiprocessing》。他们在论文里第一次提出了 promise 这个词，意思是「我现在没法立刻给你答案，但我承诺将来给你」。

紧接着 1977 年，MIT 那边 Henry Baker 和 Carl Hewitt 又发了一篇论文，标题叫《The Incremental Garbage Collection of Processes》。里面引入了 future 这个术语，意思跟 promise 差不多，「这个值现在还没有，未来再来取」。 翻译成中文就是「打白条」

这两个词在今天的 JavaScript、Python、Rust 代码里都是核心关键字。

但当年那两篇论文，根本不是写给 Web 服务器的，也跟 HTTP 请求没关系，那会儿还没这些东西呢。

Friedman 和 Wise 那篇研究的是怎么把函数式范式用到并行处理上。Baker 和 Hewitt 那篇是 Actor 模型语境下的研究，讲的是怎么给那些「将来才返回值」的进程做垃圾回收。这两个领域当时都还在象牙塔里。

这两篇论文写完， 22 年无人问津。

直到 1999 年。

那一年，一个叫 Dan Kegel 的工程师在自己的网站上发了一篇文章，叫《The C10K Problem》。这篇文章我建议每个程序员都读一遍，原文还在，地址是 kegel.com/c10k.html

C10K 的意思是 Concurrent 10000 connections，一万个并发连接。

Dan Kegel 当时提的问题就是服务器能不能同时扛住一万个客户端并发连接？

今天看一万个并发连接很正常，可在当时，这事很麻烦。一个连接一个线程，线程要栈，要调度，要上下文切换。连接数一上来，系统还没开始跑业务逻辑，先被线程本身干废了。

Kegel 那篇文章其实没解决问题，他就是把问题摆出来，列了一堆能用的技术方案。但这篇文章像个引信，引爆了后面整整十几年的服务器架构演进。

于是大家开始绕开一连接一线程的路子，搞事件循环，搞非阻塞 I/O，搞回调。nginx 和 Node.js 是这条路上的典型代表。

但问题来了。

你想表达的是，先读文件，再查用户，再写数据库，再返回结果。脑子里是一条直线。

然而事件驱动的写法叫回调，callback。一个请求来了，你注册一个回调函数，请求完了系统调你写的回调，回调里面要再发一个请求，你又要注册一个回调，回调里面再注册一个回调...

回调写出来以后，变成一层套一层，错误处理再插进来，代码越写越像一棵歪脖子树。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%882%E6%97%A5%2002_22_03.png)

这就是回调地狱。

那时候大家很自然地想，能不能让异步代码看起来像同步代码？

2012 年 8 月，C# 5.0 把 async/await 端出来的时候，很多人真的觉得这玩意是救星。

因为它让业务实现里的异步代码长得像同步代码，但底层是异步执行。

```csharp
var user = await GetUser();
var orders = await GetOrders(user.Id);
```

读着舒服，写着也舒服，异常还能用 `try catch` 接住。对写业务的人来说，这简直太爽了。

接下来五年，全行业跟进，Python 3.5 在 2015 年加了 `async` 和 `await`。JavaScript 在 ES2017 标准化 async functions。Rust 1.39 在 2019 年稳定了 `async` 和 `.await`。Swift 5.5 在 2021 年把 async/await、结构化并发和 Actor 一起端上来。

整个行业都跟着进了蜜月期。

大家发现 async/await 对线性 I/O 真的好用。你要先查用户，再查订单，再渲染页面，这种天然有先后关系的代码，用 await 写出来就是舒服。比回调好读，比 Promise 链顺手，调试起来也不那么痛苦。

```
// app.js

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 模拟查用户：比如查数据库
async function getUser(userId) {
  console.log("1. 开始查用户");

  await sleep(1000);

  console.log("1. 用户查询完成");

  return {
    id: userId,
    name: "Leo",
    level: "VIP"
  };
}

// 模拟查订单：依赖 user.id
async function getOrders(userId) {
  console.log("2. 开始查订单，userId =", userId);

  await sleep(1000);

  console.log("2. 订单查询完成");

  return [
    { id: 101, product: "MacBook Pro", price: 18000 },
    { id: 102, product: "iPhone", price: 7000 }
  ];
}

// 模拟页面渲染：依赖 user 和 orders
async function renderPage(user, orders) {
  console.log("3. 开始渲染页面");

  await sleep(500);

  console.log("3. 页面渲染完成");

  return `
    <html>
      <body>
        <h1>欢迎你，${user.name}</h1>
        <p>用户等级：${user.level}</p>
        <ul>
          ${orders.map(order => `<li>${order.product} - ￥${order.price}</li>`).join("")}
        </ul>
      </body>
    </html>
  `;
}

async function handleRequest() {
  try {
    const user = await getUser(1);

    const orders = await getOrders(user.id);

    const html = await renderPage(user, orders);

    console.log("最终 HTML：");
    console.log(html);
  } catch (err) {
    console.error("请求处理失败：", err);
  }
}

handleRequest();
```

那时候大家都觉得，终于迈过了 1999 年 C10K 问题之后留下的最后一道坎。

但有人觉得不对劲。

这个人叫 Bob Nystrom。当时在 Google 的 Dart 团队工作，业余时间写一本叫 Crafting Interpreters 的书。这本书后来成了编程语言实现领域的事实经典。

2015 年 2 月 1 日，那天他在自己的博客 stuffwithstuff 上发了一篇文章，标题叫「What Color is Your Function?」，你的函数是什么颜色。

这篇文章后来成了所有 async/await 讨论里被引用最多的一篇，没有之一。

Nystrom 在文章里设计了一个想象的编程语言，这个语言里每个函数都有颜色，要么红色，要么蓝色。

规则有四条。

一，红函数不是说红色字体，是说这个函数得用一个特殊的方式调用。

二，调用红函数的代码也得是红的。

三，红函数能调蓝函数，蓝函数不能调红函数。

四，红函数比蓝函数难写。

写到这儿你可能已经看出来了。红函数就是 async 函数，蓝函数就是普通函数。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%882%E6%97%A5%2002_14_41.png)

「红函数能调蓝函数，蓝函数不能调红函数」。这一句就是 async/await 这整套体系最深的那个坑。

回到开头那个场景。一个 fetch_user 被染成红的，那么它的调用方就得跟着染红，调用方的调用方也得染红，一路长红...

这就是很多人后来讲的函数染色。

像病毒一样。

而且这个传染是不可逆的。一旦半个项目都被染红了，你不可能再把它们退回蓝色。退回去就要把整条调用链上的 await 全删掉，还要重新实现底层。

我们以为自己逃出了回调地狱，没想到来到了无间地狱。

而且 async/await 还有一个更隐蔽的坑。

它让异步代码看起来像同步代码。

这之前是优点，对吧？

可问题也在这里。

```js
const user = await getUser(id)
const orders = await getOrders(user.id)
const recommendations = await getRecommendations(user.id)
```

这段代码看着很舒服也很干净。

但 `orders` 和 `recommendations` 真的有先后关系吗？

很多时候没有。它们都只依赖 `user`，完全可以并行发出去。可因为代码长得太像同步流程，程序员很容易顺手一个 await 接一个 await，最后把本来能同时跑的东西写成排队。

这个问题在小脚本里无所谓，在大服务里就会变成一堆很难解释的性能问题。你盯着代码看，每一行貌似都对，每个 await 都合理，但整条链路就是慢。

async 用顺序语法掩盖了依赖关系,而依赖关系，才是唯一能告诉你什么能并行的东西。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%882%E6%97%A5%2002_11_15.png)

进入 2020 年之后，痛苦开始累积到生态层。

Rust 是最典型的例子。Rust 语言本身给了 `Future` 和 async/await，但标准库没有内置运行时。于是社区长出了 Tokio、async-std、smol 这些运行时。

听起来很自洽对吧，Rust 定标准，社区搞实现。问题是这些实现，它不兼容。

Tokio 的 Future 不能直接用在 async-std 里，async-std 的 Future 也不能直接用在 Tokio 里。你得写适配器，或者干脆重写一遍。

这就像函数有红蓝，运行时也开始有颜色。

到这里，async 这个词已经不是「我帮你解决回调地狱」了。它更像是一个生态税，虽然难受，大家却又不得不用。

不过这里却有个例外。

Java 选择的是绕开。

2023 年 9 月 19 日，JDK 21 发布。里面带了一个叫 Project Loom 的项目，

Project Loom 做的事情挺反共识的。它不引入 async/await。它给你的是虚拟线程。

意思是你还是写正常的、同步风格的代码，Thread.start()，Thread.join()，跟过去 20 年一模一样。但底层 JVM 把这些线程虚拟化了，一个虚拟线程不占操作系统线程的资源，你可以同时开几百万个。

不染色。

你不需要 async await 关键字。你不需要 async-compat 这种翻译层。也不需要担心红蓝函数。

Java 这条路其实有很长的前史。从 1999 年到 2012 年那段时间，Java 已经在 Future 接口上摔过一次了。那个接口难用得要死。所以 C# 在 2012 年端出 async/await 的时候，Java 没跟，真不知道是计划还是运气，但无论如何，这是 14 年来第一个公开说「我不走 async/await 这条路」的主流语言。

无独有偶，2025 年 7 月 8 日，Zig 合并了一个 PR，标题就叫 remove async and await keywords。直接宣布语言里不会再有 `async` 和 `await` 这两个关键字。

Zig 是一门相对小众的系统级语言，主创叫 Andrew Kelley。在编程语言这个圈子，他是出了名的固执，做技术决策有自己一套思路。

2020 年 Zig 因为编译器重写，先把老的 async/await 实现给删了。当时大家以为是临时下线，迟早会回来。

结果一删五年，然后直接 「remove async and await keywords」。

注意，不是 Zig 不要异步。

它是不要把 async 和 await 做成语言关键字。

Zig 新的方向是把 I/O 抽成接口。你写函数时传进一个 `io`，像传 allocator 一样。这个 `io` 背后到底是阻塞 I/O、线程池，还是事件循环，由外面决定。

函数自己不需要因为调度方式变色。

不过这套设计还得等后面的版本继续验证，也不必过早下结论。Zig 也不是每个人都能拿去写业务逻辑的语言。

面对异步，Java Loom 是绕过去。Zig 是从根上换。两个方向，一个意思，async/await 这套运行了 14 年的体系，已经有人开始抛弃它了。

写到这里，我不想把 async/await 说成坏东西。

它当然不是坏东西。它解决了真问题，也确实让无数业务代码变得更可读。没有它，很多服务代码会退回到回调和状态机，那个更难受。

它解决了回调地狱，造成了函数染色。它让语言看起来统一，又在生态里分裂。

我想表达的是，每一代都在解决前一代的问题。每一代也都欠下了新的债。

不止是异步，计算机科学里类似的故事其实挺多的。

C 语言说我给你裸指针，你自己管理内存。然后我们花了 50 年时间发明各种 GC、智能指针、所有权系统，来还这笔债。

OOP 说一切皆对象，你照着现实世界建模就行。然后我们花了 30 年发明各种设计模式、依赖注入、函数式范式，来纠正继承层级带来的混乱。

所以我现在看 await，心态跟以前不太一样了。

该写还是写。该用还是用。

但我会比以前多停几秒。

想想这个函数真的需要变成 async 吗？

这两个 await 真的有先后关系吗？

我现在是在表达依赖，还是只是顺手让它们排队？

这几个问题，比 async/await 本身更重要。

技术债最麻烦的地方就在这儿，它很少在你写下第一行代码的时候跳出来拦你。它通常很体面，很现代，看起来甚至像进步。

然后它安静地躲进函数签名里，躲进调用链里，躲进每一个你觉得理所当然的 await 里。

等你某天只想改一个 fetch_user，却发现 30 个函数都要跟着变红的时候，你才看到那张旧账单。

哦，对了，当下的新账单叫 「vibe coding」，不过那就是另外一个故事了...

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%882%E6%97%A5%2002_17_45.png)