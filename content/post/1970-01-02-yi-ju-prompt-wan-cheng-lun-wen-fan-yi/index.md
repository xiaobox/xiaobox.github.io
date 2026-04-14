---
title: "一句 prompt完成论文翻译"
slug: 1970-01-02-yi-ju-prompt-wan-cheng-lun-wen-fan-yi
description: "从arXiv上下载id为2502.16982的论文源码，然后解压并将它翻译成中文版本，要求所有英文文字内容都翻译成中文，公式不变，表格、图片等只翻译必要的caption，代码框、算法框也只需翻译必要的注释，而人名不必翻译；将翻译后的新源码保存到解压目录下名为“paper_cn”的新目录中，要注意保持源码的可编译性；翻译完后要仔细检查一遍，看有没有漏翻译的章节和文件；最后，用xelatex将翻译结果重新编译成pdf，返回生成的pdf路径。如果翻译内容较多，应当开启多个subagent来并行翻译"
date: 1970-01-02T00:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/1970-01-02-yi-ju-prompt-wan-cheng-lun-wen-fan-yi/cover.jpg
original_url: https://mp.weixin.qq.com/s/WHV0_w1W1R6eoR7AESMKNQ
categories:
  - AI
tags:
  - Prompt
  - 算法
---
# 一句 prompt完成论文翻译

从arXiv上下载id为2502.16982的论文源码，然后解压并将它翻译成中文版本，要求所有英文文字内容都翻译成中文，公式不变，表格、图片等只翻译必要的caption，代码框、算法框也只需翻译必要的注释，而人名不必翻译；将翻译后的新源码保存到解压目录下名为“paper\_cn”的新目录中，要注意保持源码的可编译性；翻译完后要仔细检查一遍，看有没有漏翻译的章节和文件；最后，用xelatex将翻译结果重新编译成pdf，返回生成的pdf路径。如果翻译内容较多，应当开启多个subagent来并行翻译
