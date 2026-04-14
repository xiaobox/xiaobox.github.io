---
title: "AI 第一界炒币大赛正式开始"
slug: 2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi
date: 2025-10-20T13:31:47.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/kjhYuShoD-A8gtuHbBhHLg
categories:
  - AI
tags:
  - LLM
  - Claude
  - Agent
  - Prompt
  - DeepSeek
  - Gemini
---
、

**Nof1 Alpha Arena 的实时排行榜：展示不同 AI 模型在真实市场中进行加密货币交易的表现竞赛结果**

# Nof1.ai

●创始人：https://x.com/jay\_azhang  创立了 Nof1，首个专注金融市场的 AI 研究实验室，背景横跨工程、金融与生物，曾将一支小型基金从 300 万做到 2000 万美金 AUM

●https://x.com/jay\_azhang  今日强调不发行代币，猜测未来可能转向 AI 基金模式或推出专业交易 AI 模型作为订阅服务。

# Alpha Arena

2025-10-18 启动，为每个参赛大模型（如 GPT-5、Gemini 2.5 Pro、Claude Sonnet 4.5、Grok-4、DeepSeek、Qwen3 Max）分配等额 1 万美金，在 Hyperliquid 上全自动交易永续合约，并按收益、胜率、Sharpe 等指标排名

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/001-a1928f0c.png)![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/002-12cd322f.png)

# 赛制与输入的已知细节

●起始资金：每模型 $10,000

●市场与交易所：Hyperliquid 加密永续合约

●标的集合：站内面板显示 BTC/ETH/SOL/BNB/DOGE/XRP

●统一提示与输入：相同 prompts + 相同输入数据（状态里含时间、账户 / 持仓、价格与指标）。

●公开透明：官网公开成交、持仓与 “模型对话”，便于外部复核。

●实时、无人值守：并非回测 / 纸面交易。

# 查看 AI 模型具体战绩

钱包地址：

●gemini：0x1b7a7d099a670256207a30dd0ae13d35f278010f

●gpt5：0x67293d914eafb26878534571add81f6bd2d9fe06

●qwen3：0x7a8fd8bba33e37361ca6b0cb4518a44681bad2f3

●claude：0x59fa085d106541a834017b97060bcbbb0aa82869

●grok：0x56d652e62998251b56c8398fb11fcfe464c08f84

●deepseek：0xc20ac4dc4188660cbf555448af52694ca62b0734

## DeepSeek

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/003-8ee7f439.png)

## Grok

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/004-cb06f7d3.png)

## Claude

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/005-d31d8446.png)

## Qwen3

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/006-94f4a2d4.png)

## GPT-5

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/007-7442527b.png)

## Gemini

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/008-2e7e7dc6.png)

# 它 “怎么运作”

可以把 Alpha Arena 想成一个极简的 “环境 - 智能体” 回路：

## 1. 状态输入（环境→模型）

平台按固定节奏把当前时间、账户与持仓状态、实时价格 / 指标等上下文打包成结构化输入 + 统一提示词，喂给不同大模型；各家模型拿到的是相同的信息。

用 DeepSeek 举例：

### USER\_PROMPT

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/009-8e11114d.png)

### CHAIN*OF*THOUGHT

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/010-ed01fbec.png)

## 2. 决策与动作（模型→平台）

每个模型独立做出交易决策（如是否开/平仓、做多/做空、仓位大小等），平台把模型的决策解析为具体委托并在 Hyperliquid 实盘执行。全流程实时、无人干预，不是模拟撮合。

## 3. 执行与记录（平台→公开面板）

成交、持仓与账户净值会回流到网页的 Completed Trades / Positions / Leaderboard；页面还提供 ModelChat 以便外界事后审阅模型在每次决策前后的对话记录（他们强调透明度）。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/011-def55506.png)

## 4. 评估与排名（平台→指标）

除了原始 P&L，他们强调风险调整，目标设定为 “最大化风险调整后的收益”。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/012-5985d82c.png)

# AI 的使用原理

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-20-ai-di-yi-jie-chao-bi-da-sai-zheng-shi-kai-shi/013-87832846.png)

1.统一输入 / 统一提示词：为了可比性，所有模型吃到同一份上下文与提示词；这与许多学术基准 “同题同卷” 的精神一致。

2.非平稳、对抗型环境：和静态 NLP / 推理基准不同，真实市场是动态与对抗的，能暴露 “幻觉”“过拟合历史样本” 等问题，因此更能检验模型在开放环境里的泛化与鲁棒性。

3.以风险调整为目标：不是单看收益，而是看单位风险产出的超额（Sharpe 等），这迫使大模型在仓位、止损、持仓时长等维度做出权衡，而不是 “梭哈式” 极端行为。

# 问题

●样本期短 / 资金体量小：短期与小资金的排名不稳健，对可复制性、滑点与冲击成本的代表性有限

●“同题同卷” 的一致性风险：若市场参与者观测并抄作业，可能诱发 同质化行为（“羊群效应”）；业内也有人担心 “共识化 AI 策略” 带来的同步风险。

●评价口径仍在演化：他们强调 SharpeBench，但具体的风控边界 / 频率配额等细节页面上看没到。

**AI 交易，安全可控永远是第一位的。**

# 未来

如果时间线拉长，可能咱们绝大多数人 P 不过 AI，币圈以后的发展方向会不会 Cex 和 Dex 上只剩一堆 AI 策略在？
