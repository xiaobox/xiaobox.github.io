---
title: "项目"
description: "我做过的开源项目和小产品"
date: 2026-04-14
---

这里收录我自己折腾出来的开源项目和小产品 —— 有些是工作之外的完整产品，有些是为了解决自己某个具体问题写出来的工具。如果对你也有用，那就更好了。

## Modern MD Editor

> 高颜值 Markdown 编辑器 + 社交平台发布器。面向创作者与内容团队，写完就能一键复制成适配微信公众号等社交平台的高保真富文本。

- 🌐 **在线体验**：<https://mmdeditor.boxtech.icu>
- 📦 **GitHub**：<https://github.com/xiaobox/mdeditor>
- 🛠 **技术栈**：Vue 3 · Vite · JavaScript
- 🏷 **标签**：`markdown` `editor` `wechat` `vue3` `vite`

**能做什么**

- 所见即所得的实时预览，多端视口切换（手机 / 平板 / 桌面）
- 一键把 Markdown 转成微信公众号适配的富文本，样式自动内联
- 字体、行高、字距、主题全部可调，支持多套预设主题
- 从写作到发布的最后一公里：复制 → 粘贴到公众号后台 → 样式不跑形

**为什么做它**

写公众号最痛的点就是样式 —— 在 Typora 里排得整整齐齐，粘到公众号后台全乱了。大部分 Markdown 编辑器要么不支持内联样式，要么复制过去代码块 / 列表 / 引用格式丢一半。Modern MD Editor 把这件事做成「所写即所发」：你只管写 Markdown，剩下的交给它。

---

## AI Model Price

> 一站式 AI 模型价格聚合与对比。把 OpenAI、Claude、Gemini、AWS Bedrock、Azure OpenAI、OpenRouter、xAI 等主流厂商的模型定价抓到一起，支持横向比较，方便选型和成本估算。

- 🌐 **在线体验**：<https://modelprice.boxtech.icu/>
- 📦 **GitHub**：<https://github.com/xiaobox/model-price>
- 🛠 **技术栈**：FastAPI (Python) · React · TypeScript
- 🏷 **标签**：`llm` `pricing` `openai` `claude` `gemini`

**能做什么**

- 聚合主流 LLM 厂商（OpenAI / Anthropic / Google / AWS Bedrock / Azure / OpenRouter / xAI 等）的最新价格
- 按 input / output token 价格横向对比，一眼看清谁便宜、谁贵
- 筛选模型家族、上下文长度、能力标签，快速定位候选
- 方便做选型评估和成本粗算，不用再翻七八个官网定价页

**为什么做它**

做 AI Infra 和 Agent 应用时经常要回答一个很土但很重要的问题：「这个场景跑 100 万 token 要多少钱？」每家官网的定价格式都不一样，有的按 1K 报价，有的按 1M，有的还把 input/output/cached 拆开算，对比起来非常折磨。干脆做个聚合页，一次解决这类反复发生的小痛苦。

---

## 还有更多？

更多小工具和实验项目散落在 [GitHub @xiaobox](https://github.com/xiaobox)，有合适再挑出来单独写在这里。

如果你有想法想一起折腾，或者对上面某个项目有建议 / 想报 bug，欢迎 [发邮件](mailto:helongisno1@gmail.com) 或在对应项目里提 issue。
