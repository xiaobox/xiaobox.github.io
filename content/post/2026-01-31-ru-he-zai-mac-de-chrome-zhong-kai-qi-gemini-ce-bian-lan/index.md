---
title: "如何在 mac 的 chrome 中开启 gemini 侧边栏"
slug: 2026-01-31-ru-he-zai-mac-de-chrome-zhong-kai-qi-gemini-ce-bian-lan
description: "昨天折腾了半天，厕所都没上，没搞定，今天一分钟搞定了，其实非常简单。"
date: 2026-01-31T02:03:30.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-31-ru-he-zai-mac-de-chrome-zhong-kai-qi-gemini-ce-bian-lan/cover.jpg
original_url: https://mp.weixin.qq.com/s/S7zQYgKJ2g5fSQjgA_HKcw
categories:
  - 工具与效率
tags:
  - macOS
  - Chrome
  - Gemini
---

昨天折腾了半天，厕所都没上，没搞定，今天一分钟搞定了，其实非常简单。

![图片](001-a19868cf.png)

前提条件什么的自不用说，主要是两步，我是 mac 系统，windows 的不知道。

## 第一步

把语言设置一下，注意是在操作系统中设置chrome 的自定义语言

![图片](002-f2b3a06f.png)

## 第二步

打开终端，输入以后命令后回车

⚡ 代码片段`open -n -a "Google Chrome" --args --variations-override-country=us`

也可以用这个项目设置一下 ：https://github.com/lcandy2/enable-chrome-ai

然后重启 chrome 就可以了，location 如果不支持，你应该知道怎么办吧，哈哈。
