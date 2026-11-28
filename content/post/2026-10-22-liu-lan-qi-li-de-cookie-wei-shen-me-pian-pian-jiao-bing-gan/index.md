---
title: "浏览器里的 Cookie，为什么偏偏叫饼干？"
slug: 2026-10-22-liu-lan-qi-li-de-cookie-wei-shen-me-pian-pian-jiao-bing-gan
description: ""
date: 2026-10-22T04:00:00.000Z
image:
original_url:
categories:
  - 系统底层
tags:
  - Chrome
  - 网络
---

排登录 bug 的时候，打开 DevTools 看 Network，那个响应头里写着 `Set-Cookie: session=...` 的东西，每个写过 web 的人都见过。

你点开一个网站，左下角弹出来「我们使用 Cookie 改善体验」，每个上网的人也都见过。

但你有没有想过，这玩意为什么叫 cookie。

跟饼干没半毛钱关系。这个名字从 1994 年起，30 年没变过。

愚钝如我，DevTools 里 `Set-Cookie` 看了几年，没怎么琢磨过这个名字怎么来的。直到顺着它翻到 Lou Montulli 2013 年的一篇博客。

故事是这样的。

1994 年那个夏天，Netscape 接了一个活儿，给一家叫 MCI 的电信公司做在线购物商城，项目名叫 marketplaceMCI。要解决一个老问题，HTTP 没有记忆。

你点开一个商品加进购物车，请求发到服务器，服务器返回 200 OK。下一次你点付款，服务器一脸懵，刚才你是谁来着。

MCI 当场否了服务端存状态的方案，要求这块状态放到客户端去。

那次会议 MCI 派来的人里有一个叫 Vint Cerf，对，就是那个跟 Robert Kahn 一起把 TCP/IP 端出来的人。

接活的是 Netscape 一个年轻工程师，叫 Lou Montulli。他在堪萨斯大学那会儿写过 Lynx，那个直到今天还有人在终端里跑的文本浏览器。

Montulli 接了这块需求，想了几天。他后来在自己博客里写，那阵子脑子里反复转着一个词，magic cookie。

这个词他在大学上操作系统课时听过，是 Unix 老黑话。意思是，一个程序交给另一个程序的一小段不透明数据，接收的人不用关心里面是什么，回头原样还回来就行。最早能翻到的用法，是 1979 年 Unix V7 那本 `fseek` 手册页。

Montulli 觉得这个词跟他要做的东西意思接近。服务器塞给浏览器一小块东西，浏览器自己存着，下次请求带回来，服务器一看就认得。

他把 magic 砍掉，只留 cookie。听着也比 magic cookie 顺。最后留下来的名字，就叫 cookie。

跟他一起做设计审查的，是另一个 Netscape 工程师 John Giannandrea。这个人没参与代码实现，给的主要是设计建议。但你今天大概率听过他的名字，他后来去了 Google，又到 Apple 管机器学习和 AI 战略。30 年前帮 Montulli 把 cookie 设计审一遍的那个人，30 年后是 Siri 背后那个 AI 老大。

回到 1994 年。Montulli 设计完，写了规范，源码 10 月初进了 Netscape 仓库。10 月 13 日 Mosaic Netscape 0.9 beta 公开发布，cookie 跟着出门了。

到 1997 年 2 月，Bell Labs 的 Dave Kristol 和 Montulli 把这套机制写进 RFC 2109。你今天在 DevTools 里看到的 `Set-Cookie` 和 `Cookie`，在 Netscape 最早那份规范里就已经有了。

---

Cookie 没停在购物车里。

广告公司很快盯上了这个机制。一个页面里只要嵌了广告公司的素材，浏览器就会顺手跟那个域名交换 cookie。素材铺得够广，同一个浏览器就会在不同网站上被认出来。第三方 cookie 就这么长出来了。

Montulli 跟 Kristol 写 RFC 2109 的时候明明写了，第三方 cookie 默认应该禁用。但浏览器和广告生态没按这条路走，跨站追踪越滚越大。再往后，****隐私法规也跟上来，才有了你今天熟悉的那些 Cookie 提示。

2024 年 7 月 22 日，Google 宣布放弃淘汰 Chrome 里的第三方 cookie。

从 2020 年宣布要逐步淘汰开始，Chrome 折腾了四年多，最后改成把选择权交给用户，Privacy Sandbox 继续往前推。

你今天看到 `Set-Cookie` 那行响应头，看到角落的「同意 Cookie」弹窗，背后都是 1994 年那个夏天 Netscape 会议室里几个人决定，让浏览器自己记一小段不透明数据。

名字还是那个名字。1994 年从堪萨斯大学操作系统课捡来的那个 Unix 老黑话，30 年过去，整个谷歌都干不掉。

