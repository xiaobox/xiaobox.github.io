---
title: "我在 DeepSeek 敲了一个 <think>，它开始自己跟自己说话"
slug: 2026-05-16-wo-zai-deepseek-qiao-le-yi-ge-think-ta-kai-shi-zi-ji-gen-zi-ji-shuo-hua
description: ""
date: 2026-05-16T05:00:00.000Z
image: 
original_url: 
categories:
  - AI
tags:
  - DeepSeek
  - LLM
  - Token
  - Prompt
  - 安全
---

今天看到一个挺有意思的现象。

有人在 DeepSeek 的输入框里敲了几个字符，`<think>`，然后什么问题都没问，直接按回车。

DeepSeek 给它吐回来一段八竿子打不着的内容。有时候是数学题，刷新一下变成小说开头，再刷新，又开始算日子。

每次都不一样。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260517112700452.png)

````markdown
**[配图 1 重生成 ｜ 方案 A 抽象鲸鱼 + DeepSeek 蓝]**  生成后替换上方旧图链接

Prompt：
```text
浅色扁平数字插画，16:9，画面中央偏左是一个手绘线稿风格的小鲸鱼侧影（简笔，不要写实，不要彩色填充，只用 DeepSeek 蓝 #4D6BFE 描线），鲸鱼嘴部正在"吐出"一个清晰的代码标签「<think>」。画面右半部分是一块 AI 聊天回复区域，里面出现互相不相关的内容碎片，一块像数学公式，一块像小说开头，一块像日期推算，每块都很短。整体浅灰背景，深灰线条，DeepSeek 蓝点缀，少量红色异常提示。鲸鱼形态要明显但绝对不能模仿任何公司的注册 logo，风格像 GitHub README 里的技术示意图。不要真实人物，不要复杂 logo，不要密集文字。
```
````

看到这种截图，很多人第一句就是，完了，模型疯了。再往下一想，又会怀疑是不是漏了训练数据。

其实都不是。

这类问题有个名字，Special Token Injection。

把输入框后面那点东西摊开看，LLM 在内部不是用我们看到的「问答」格式跟用户交流的，它有自己一套对话协议。打开 DeepSeek 的 tokenizer 配置，你能看到一堆这样的字符。

`<｜begin▁of▁sentence｜>` 表示对话开始。

`<｜User｜>` 后面接的是用户说的话。

`<｜Assistant｜>` 后面接的是模型要回的话。

`<think>` 和 `</think>` 中间，是模型推理的草稿。

这些字符叫 special token，是模型训练时用来区分谁在说话、在做什么动作的分隔符。它们在词表里都被分配了独立的 ID，模型看到这些 ID，就会切到对应的模式里。

平时我们敲一个「你好」，DeepSeek 看到的并不是这两个字。它看到的是一段拼好的模板，类似 `<｜begin▁of▁sentence｜><｜User｜>你好<｜Assistant｜>`，然后从最后那个 `<｜Assistant｜>` 之后开始往下说。

坑就在这里。

如果用户直接把 `<think>` 打进输入框，而模板层又没把它当普通文字关起来，tokenizer 就可能把它认成真的控制 token。

这样一来，DeepSeek 看到的就像一块后台路牌，被人塞进了用户留言里。

按训练时的样子，模型应该看到「用户问了一个问题，我要回答」。现在模型看到的是 `<think>` 直接出现在用户位置，然后什么问题都没有。它的训练数据里没有这种结构，但它必须继续生成下去。

它没去数据库里捞东西。前缀给到这里断了，也没有问题作锚点，它只能顺着训练分布往下接。于是你看到的就是一堆碎片，一会儿数学，一会儿小说，这跟训练数据泄露没关系。

到这里就能看出来了，麻烦不在模型脑子里，在模板那层字符串胶水里。它没把控制 token 当普通文字锁住。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ChatGPT%20Image%202026%E5%B9%B45%E6%9C%8817%E6%97%A5%2011_24_29.png)

这也不是 DeepSeek 一家的毛病。很多模型都有自己的对话格式，早期 ChatML 有 `<|im_start|>`，Claude 旧格式也用过 `Human` / `Assistant` 这种分隔。

只是有些商业 API 把这层包起来了，用户摸不到原始模板。DeepSeek 把权重和配置放出来，这些后台路牌就明晃晃摆在文件里。

Trend Micro 去年的红队报告里有个更危险的例子。他们测的是 671B 的 DeepSeek-R1，问题出在 R1 默认就把思考过程放在 `<think>` 标签里展示。结果最终回答里没泄密，思考区反而把系统提示里的 API key 带了出来。



所以后面再看到模型突然抽风，我可能会先去翻它前面的模板。很多怪事，就卡在那层字符串胶水里。

那一行 `<think>` 撬开的，就是这一层。
