---
title: "动画演示 Node.js 的事件循环"
slug: 2026-03-03-dong-hua-yan-shi-node-js-de-shi-jian-xun-huan
description: "如果把 Node.js 比作一家快餐店：主线程（前台收银员）： 只有一个人。他负责接待顾客点单（执行同步代码）。"
date: 2026-03-03T04:38:15.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-03-03-dong-hua-yan-shi-node-js-de-shi-jian-xun-huan/cover.jpg
original_url: https://mp.weixin.qq.com/s/2iAP4vc0sh9B3MULATG30A
categories:
  - 后端
tags:
  - JavaScript
  - 多线程
---
如果把 Node.js 比作一家快餐店：

1.  **主线程（前台收银员）：** 只有一个人。他负责接待顾客点单（执行同步代码）。他动作很快，绝不离开柜台。

2.  **异步任务（复杂的后厨订单）：** 顾客点了需要烤 20 分钟的披萨（读取大文件）。

3.  **libuv/底层系统（后厨团队/烤箱）：** 收银员把订单贴到后厨窗口就继续接待下一位顾客了。后厨团队（线程池）或者烤箱（系统内核）开始默默干活。

4.  **Callback Queue（出餐台）：** 披萨烤好了，后厨把它放到出餐台，并附上小票“3号桌的披萨好了”。

5.  **Event Loop（收银员的习惯动作）：** 收银员每服务完一个顾客（主线程空闲），就会下意识地回头看一眼出餐台。如果看到有做好的餐，就把它端给顾客（执行回调函数）。
