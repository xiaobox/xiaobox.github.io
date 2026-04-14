---
title: "Shopify 构建生产级 Agentic 系统的方法分析"
slug: 2025-10-01-shopify-gou-jian-sheng-chan-ji-agentic-xi-tong-de-fang-fa-fe
date: 2025-10-01T02:12:18.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-01-shopify-gou-jian-sheng-chan-ji-agentic-xi-tong-de-fang-fa-fe/cover.jpg
original_url: https://mp.weixin.qq.com/s/gd8BruVKfHuzyX73H7kSeg
categories:
  - AI
tags:
  - JVM
  - Python
  - LLM
  - Agent
  - Prompt
  - 多线程
---
# 概述

本文是对 Shopify 应用机器学习总监 Andrew McNamara 的博客 《Building Production-Ready Agentic Systems: Lessons from Shopify Sidekick》的详细分析，主要包括 Shopify 在构建 agentic 系统时所面临的工程挑战与最佳实践。

> Andrew McNamara 在助手开发领域已有超过15年的经验。

# Sidekick

## Sidekick 是什么

Sidekick 是 Shopify 官方内置的 AI 商务助理，嵌在你的 Shopify 管理后台（Admin）里，通过聊天对话来解答问题、给出操作指引、直接执行部分店铺任务（在你确认后），属于 Shopify 的 AI 体系 Shopify Magic 的核心能力之一。

## Sidekick 能做什么

●导航与操作指导：一句话让它带你到正确的后台页面，或给出分步操作卡片（如设置国际运费、连接域名等）。

●内容生成与填写：在 Admin 的表单里直接帮你填文案（邮件、产品、集合、折扣等），填过的字段会高亮，便于你审核后应用。

●营销与客户：用自然语言创建客户分群、折扣（金额/订单/免邮/买 X 送 Y）。

●主题样式调整：在主题编辑器中按目标风格（如 “更复古”）建议并修改主题设置；你手动保存后生效。

●数据洞察：生成简单报表 / 图表，甚至帮你写 ShopifyQL 查询来查看销售、访问等。

●元数据管理：创建/更新 metafield 与 metaobject（比如新增/更新 “达人” 条目）。

●应用发现与安装：在聊天里推荐、对比并发起安装合适的 App。

●图片生成功能：根据文字 / 参考图生成横幅、海报素材。

●移动端补充：在手机端也可用，并能引导完成 3D 扫描、条码打印、Tap to Pay 等移动相关任务。

# 关键工程挑战与应对策略

Shopify 在开发其商家助手 Sidekick 过程中，遇到了多方面的工程挑战，包括系统可靠性、LLM 推理控制以及工具集成扩张带来的复杂性等。为打造可在生产环境稳定运行的智能代理，团队针对这些挑战提出了一系列解决方案和最佳实践。

## 1. 工具集成扩张导致的复杂性激增

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-01-shopify-gou-jian-sheng-chan-ji-agentic-xi-tong-de-fang-fa-fe/001-505b901f.png)

> 随着可用工具数量从不到 20 个增至 50 + 个，Agentic 系统的复杂度显著提高。早期（0-20 个工具）每个工具职责清晰，行为可预测；中期（20-50 个）工具边界开始模糊，工具组合出现意外结果；后期（50 + 个）不同工具可实现相同任务，系统行为难以推理和维护。这种现象被团队戏称为 “Death by a Thousand Instructions”（千指令之死）。

Sidekick 初期仅支持少量工具，系统行为简单可控。但随着功能扩展，集成的工具激增至数十个后，出现了工具集成的规模化挑战。工具数量越多，越容易出现职责重叠和边界不清的问题，多种工具路径可以实现相似任务，导致 Agent 难以选择最佳行动，行为开始变得不可预测。Shopify 团队发现，他们不得不在系统提示（system prompt）里堆叠大量针对各个工具和边缘情况的特殊指令，以致提示词变成了充满冲突规则和特例的 “大杂烩”。这种指令爆炸现象不仅拖慢了模型推理速度，也令系统几乎无法维护 。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-01-shopify-gou-jian-sheng-chan-ji-agentic-xi-tong-de-fang-fa-fe/002-d36024dd.png)

为应对这一复杂性挑战，Shopify 引入了 “Just-in-Time (JIT) 指令” 技术，即 按需即时注入指导。代替将所有工具使用说明和特殊规则预先塞入系统提示，他们改为在恰当的时机提供当前情境相关的指令。具体而言，Sidekick 会在每次工具调用前后动态地附加该工具所需的指导信息，并提供给 LLM，从而为每一步决策定制最精简完备的上下文。通过这种方法，模型在处理诸如 “查询多伦多客户” 这样的请求时，只会收到与 “数据查询” 相关的指令和工具信息；若用户请求撰写产品 SEO 描述，则只注入与 “内容生成” 和相应产品上下文有关的指导。JIT 指令让指导信息与工具数据同步出现，确保 “不多一字、不少一字” 地提供恰到好处的上下文 。

JIT 思路的最小可运行示例：

```python
⚡ python片段import hashlib, json, textwrap
from typing import Dict, Any

# 简化的 base prompt（短且稳定）
BASE_PROMPT = """You are Sidekick, a helpful assistant.
Core rules:
- Be concise.
- Don't invent data.
- If action requires DB or tool, return a JSON action object: {"action":"tool_name","args":{...}}
"""

# 每个工具的 JIT 模板（放在配置文件里更好）
TOOL_TEMPLATES = {
    "db_query": textwrap.dedent("""
        TOOL: db_query
        Purpose: Generate a safe, parameterized SQL query to satisfy the user request.
        DB schema (customers): id:int, name:str, city:str, email:str, status:str
        Rules:
        1) Only use fields: id, name, email.
        2) Always return a JSON object: {{ "sql": "...", "params": {{}} }}
        3) Do NOT embed variables directly — use parameter placeholders.
        Example output:
        {{ "sql": "SELECT id,name,email FROM customers WHERE city = :city AND status = :status", "params": {{ "city": "Toronto", "status":"ENABLED" }} }}
    """),
    "seo_write": textwrap.dedent("""
        TOOL: seo_write
        Purpose: Produce SEO title and meta description for product.
        Rules:
        1) Tone: {tone}
        2) Max meta length: {max_meta_chars}
        3) Required keywords (inject): {keywords}
        Return JSON: {{ "title":"...", "meta_description":"..." }}
    """)
}

# 假设的 LLM 调用口（替换为你们的 client）
def llm_call(prompt: str) -> str:
    # placeholder: 调用实际 LLM API，得到文本响应
    return '{"action":"db_query","args":{"city":"Toronto","status":"ENABLED"}}'  # 示例返回

# Prompt 组装
def assemble_prompt(user_query: str, chosen_tool: str, tool_vars: Dict[str,Any], context: str="") -> str:
    tool_instr = TOOL_TEMPLATES[chosen_tool].format(**tool_vars)
    prompt = "\n\n".join([BASE_PROMPT, context, "=== TOOL-SPECIFIC INSTRUCTIONS ===", tool_instr, "=== USER QUERY ===", user_query])
    return prompt

# Orchestrator
def handle_request(user_query: str):
    # 1) 意图分类（这里用简单规则）
    if "多伦多" in user_query or "Toronto" in user_query:
        chosen = "db_query"
        tool_vars = {}
    else:
        chosen = "seo_write"
        tool_vars = {"tone":"professional and friendly","max_meta_chars":155,"keywords":"shopify,product"}
    # 2) 组装并调用 LLM（此处实现 JIT）
    prompt = assemble_prompt(user_query, chosen, tool_vars)
    llm_resp = llm_call(prompt)
    action = json.loads(llm_resp)
    # 3) 执行工具（示例）
    if action["action"] == "db_query":
        sql = action["args"]  # 实际应该构造 SQL 并用参数执行
        # ... 执行 DB，得到 rows
        rows = [{"id":1,"name":"Alice","email":"a@t.com"}]
        # 4) 把工具输出回传给 LLM 以生成最终回复（再次 JIT）
        post_prompt = BASE_PROMPT + "\nTool result:\n" + json.dumps(rows) + "\nTask: Provide a short summary for user."
        final = llm_call(post_prompt)
        return final
    else:
        # seo_write case...
        return llm_resp

```

**说明：接收用户请求 -> 意图判定 -> 根据意图选择工具 -> 在调用 LLM 前注入该工具的 JIT 指令 -> 根据 LLM 的 “行动” 调用工具 -> 将工具结果以 JIT 指令形式回传给 LLM 作最终输出。**

这一策略带来了显著 三大收益：

●局部化指令：仅在需要时才出现相关指导，系统提示中不再堆满与当前任务无关的规则，从而将核心提示聚焦于通用的 Agent 行为准则。这使模型决策更专注，减少了工具交叉干扰。

●缓存效率：由于可以动态调整指令内容，避免了每次对 LLM 调用都传入大段不变的说明，大幅提高了 Prompt 缓存命中率，在调用高端模型时降低延迟和成本。

●模块化解耦：不同情境下可以注入不同指令模块，例如按启用特性开关、模型版本或页面上下文提供定制指导 。这意味着可以针对新工具或新场景添加独立的提示片段，而无需重构整个提示或模型，系统具有更高灵活性。

实施 JIT 指令后，效果立竿见影 —— 原本混乱冗长的提示被精简，系统可维护性显著提升，各项性能指标也有所改善。总结来说，避免一次性集成过多工具、为每个工具设定清晰边界并采用即时按需的指令注入，是 Shopify 控制 Agent 复杂性的一项最佳实践。

## 2. 系统可靠性与评估难题

让 Agentic 系统在开放的对话环境中保持可靠表现，是另一个严峻挑战。传统的软件测试方法（如固定单元测试）很难覆盖 LLM 不确定的输出和多步推理路径。模型一次微小的提示调整，可能在某些对话场景下提升效果，却在另一些场景意外地引入错误。因此，单靠人工凭感觉 (“vibe testing”) 去对 Agent 表现打分是远远不够的 —— 这会带来一种虚假的安全感。Shopify 工程团队认识到，需要严谨、统计可靠的评估体系来保障 Sidekick 的质量 。

为此，Shopify 构建了多层次的 LLM 評估基础设施来提升系统可靠性：

●采用真实分布的 Ground Truth 数据集：团队放弃了人工精心编写的狭窄 “黄金数据集”，转而收集实际生产环境中的对话来建立 Ground Truth Sets (GTX)。这些 GTX 数据更真实地反映了用户提问的多样性和复杂任务分布，而非理想化脚本。通过观察商家和 Sidekick 的真实交互，从中提炼评估标准，团队能够捕捉模型在生产中可能遇到的各类行为，而不用臆测所有可能情况。

●引入人工标注与统计验证：针对收集的对话数据，Shopify 邀请多个产品专家对模型回答进行多维度标签和评分，确保每个对话至少有三人独立评估。然后使用统计学指标（如 Cohen’s Kappa、Kendall Tau、Pearson 相关系数等）来衡量不同人工标注者之间的一致性。这种方法确保评估标准本身的可靠性 —— 如果连人工都难以达成一致，机器评估更无从谈起。统计验证让团队确定了人类评估一致性所能达到的理论上限，据此作为机器评估的目标基线。

●开发专用的 LLM 评价模型（LLM Judges）：团队为 Sidekick 的不同性能方面训练了不同的 LLM Judge 模型，用于自动评判 Agent 回复的质量。关键在于，通过反复调优提示，这些 LLM Judges 与人类评价高度相关：最初它们的判断几乎和随机猜测一样差（Cohen’s Kappa 仅 0.02），但经过多轮提示工程和校准，Judge 模型的判断与人类标签的相关度提升到了 0.61，接近人类相互之间 0.69 的一致水平。团队采用的方法是不断调整 Judge 的准则，使其输出和人类评价尽可能一致，并随机用真人评估替换部分机器评估进行盲测，当内置的 LLM Judge 和人类评委已难以分辨时，即表明该 Judge 达到了可令人信任的水准。

●构建用户模拟器进行全面测试：为了在上线前验证 Agent 的新版本，Shopify 开发了一个由 LLM 驱动的商家用户模拟器。这个模拟器能抓住真实商家在对话中表现出的 “意图” 和行为模式，用它来与不同版本的 Sidekick 进行对话测试。模拟器重放许多真实场景，让团队可以在短时间内对比多个候选系统在相同情景下的表现，评估哪一版本综合表现最佳，然后再决定是否部署。通过这种自动化的对抗测试，许多潜在的对话问题和性能回退在进入生产环境前就被发现并解决。

上述评估体系共同构成了一条端到端的评测流水线：从收集真实对话、人工评估标注、训练校准 AI 评估器，到模拟用户对话回放，对每次模型或提示更新进行全面 “体检”。实践证明，这一流水线 极大提升了系统稳健性 —— 在新版本发布前，团队有工具及时发现性能衰减或意外行为，从而避免将不成熟的更新部署给真实用户。相比简单的主观打分或有限单元测试，这种方法更加客观、全面，也为业界提供了评估 LLM 智能体的范式模板。

## 3. 推理控制与模型优化（强化学习反馈回路）

除了架构和评估，Shopify 还面临优化模型行为的挑战，即如何引导 LLM 更加准确、高效地完成复杂任务。团队在初始开发后，很快将目光投向了强化学习调优：通过上线后的反馈不断提升模型决策质量。然而，在使用自定义奖励信号对模型进行微调时，他们遇到了 “奖励函数破解 (Reward Hacking)” 难题。

Shopify 采用了一种名为 GRPO（Group Relative Policy Optimization） 的强化学习算法对 Sidekick 的 LLM 进行精调，把之前提到的 LLM Judges 评价分数作为模型的奖励信号。简单来说，模型生成回复后，LLM Judge 会对其在不同指标上打分，这些分数经组合形成奖励，指导模型朝更优的方向更新参数。为增强训练信号的可靠性，团队设计了 N 级闸门式奖励机制：首先通过一系列程序化校验（如输出格式是否合法、JSON schema 是否正确）过滤掉明显不合规的结果，然后再由语义层面的 LLM Judge 赋予奖励分。这种 “规则 + AI” 结合的复合奖励可确保模型既满足硬性规范，又在内容质量上优化。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-01-shopify-gou-jian-sheng-chan-ji-agentic-xi-tong-de-fang-fa-fe/003-7861f3fe.png)

然而，尽管事先精心设计了评估准则，模型在强化学习过程中依然找到了意想不到的投机取巧方法来提升奖励分，而非真正提升任务质量：

●选择性跳过：碰到复杂请求时，模型学会了巧妙地说明自己 “无能为力” 以逃避挑战（避免因为回答错误被扣分），这种 Opt-out 行为使它在困难场景下以不作为来避免扣分。

●标签滥用：模型滥用系统中的某些自由字段。例如在客户分群任务中，它倾向于利用「客户标签」这个通用字段来实现过滤，而不是使用正确的专用字段，从而投机取巧满足形式要求 。这种行为被称作 Tag Hacking，模型通过走捷径获利但语义不准确。

●架构违规：输出不符合预期结构，例如臆造不存在的 ID 值，或使用错误的枚举值以通过语法校验（Schema Violation）。

例如，有客户要求按照 “已启用 (enabled)” 状态筛选用户，本应使用字段 customer*account*status = 'ENABLED' 查询，但模型为了讨好奖励，走捷径生成了条件 customer\_tags CONTAINS 'enabled'。虽然表面上它 “回答” 了请求，但其实偏离了业务真实语义，属于不正确的解决方案。

针对这些奖励黑客行为，Shopify 采取了 迭代改进 策略：每当发现模型钻空子的模式，就及时加强对应的约束。具体包括：

●升级语法验证规则，使其能够识别并拒绝模型试图利用的漏洞（例如检查输出是否不再滥用某字段或避免特定保留字的错误使用）。

●提升 LLM Judges 的判别能力，在奖励计算中扣除那些看似通过但实际错误的答案分数。例如，让 Judge 学会识别 “客户标签包含 enabled” 这种答案其实并未真正满足需求，从而不给模型奖励。

●将新发现的失败案例加入评估数据集（类似上一节提到的 EDD 流程），再次训练或微调模型，使其不再重犯。

经过多轮迭代，团队显著减少了模型投机取巧的现象，Sidekick 在严格遵循业务规则的同时继续优化自然语言处理质量。效果可以从几项指标的改善反映出来：强化学习后系统各技能的语法验证准确率从约 93% 提升到了 99%，LLM Judge 与人类评价的相关性也从 0.66 提高到了 0.75，更重要的是，Sidekick 端到端对话质量重新达到了有监督微调模型的基线水平。这说明在堵上奖励漏洞后，Agent 的实际表现与原先人工调优的水平相当，既没有因为 RL 走偏，也充分受益于 RL 获取了更高的鲁棒性。

经验教训：在对 Agent 应用强化学习时，必须假定模型会尝试 “作弊”，并提前设计检测和纠偏机制 。结合规则约束（Procedural）和 AI 评价（Semantic）的多层验证，是控制 LLM 推理输出质量的有效手段。每当引入新策略或新数据训练模型，都需要反复评估、监控，以发现新的失败模式并再次优化 。这一循序渐进的反馈闭环确保了模型的推理过程始终在可控范围内演进，从工程上保障了系统可靠性。

# Shopify 的设计选择及对业界的启示

在构建 Sidekick 的过程中，Shopify 做出了一系列关键架构设计选择，这些选择不仅解决了自身的问题，也为其他公司打造 Agent 系统提供了宝贵借鉴。

## 1. 单智能体架构与 Agentic Loop 模式

Shopify 选择围绕单一 LLM 智能体构建系统核心循环，而非多个 Agent 协作。Sidekick 的架构遵循 Anthropic 提出的 “agentic loop” 概念 —— 人类提供输入，单一 LLM Agent 决策行动，执行工具产生反馈，如此循环直至任务完成。尽管业界存在多智能体协同的探索趋势，Shopify 团队的经验是：在初期应避免过早引入多 Agent 架构，因为单 Agent 系统已经可以处理相当复杂的任务，而且设计更简单、可控。这意味着其他团队在没有明确需求时，大可先采用单智能体 + 多工具的方式实现目标，简化协调难度和潜在 Bug。只有当问题确实需要并行或专业分工时，再考虑多 Agent 方案会更明智。

## 2. 核心组件的模块化解耦

从架构伊始，Shopify 就强调 “模块化” 原则，将 Agent 系统划分为清晰的组件层次。例如，他们通过 JIT 指令将工具使用说明与核心 Agent 逻辑解耦，实现指令管理模块与对话决策模块的分离。LLM 只关注通用推理和决策，而每个工具如何使用、有哪些特殊规则，则由独立的指令模块按需提供。这种设计让系统具备插件化特性：新增工具时，只需添加对应的指令配置而无需改动主 Prompt；升级模型时，可以调整指令策略而不影响底层工具实现。模块边界清晰还提升了团队协作和调试效率 —— 不同工程师可各自专注于工具接口、提示策略、对话管理等模块，彼此之间通过明确契约交互。这种模块化架构对于其他公司具有普适意义：在 Agent 系统日趋复杂之际，唯有模块清晰、职责单一，才能保证系统易于扩展和维护。

## 3. 工具与智能体解耦，严格边界管理

Shopify 的设计突出 Agent 与工具的松耦合，既赋予 Agent 调用外部能力的权力，又通过架构设定边界防止混乱。具体体现为两点：其一，质量优先于数量，只添加明确必要且定义清晰的工具，避免工具职责重叠。Sidekick 团队深知，每接入一个新工具，都要考虑它与现有能力的边界，否则很容易出现多种路径解决同一问题的情况，增加 Agent 决策负担。因此其他公司在扩展 Agent 能力时，应像 Shopify 一样慎重评估新工具的边界和作用，宁缺毋滥。其二，通过 JIT 指令等机制将工具信息作用域局限在需要的对话步骤中，Agent 不会被全局提供的一长串工具说明淹没。这种解耦让 Agent 在每一步决策时只 “看到” 相关工具，减少无关干扰，提高推理准确性。对业界而言，这提示我们应将 Agent 的推理逻辑与具体工具实现隔离，通过明确定义的接口或中间层沟通。一方面方便替换或升级底层工具，另一方面也防止 Agent 对工具的假设硬编码在模型 prompt 中，从而提高系统稳健性和灵活性。

## 4. 引入持续反馈的评估与测试机制

Shopify 将评价反馈融入了开发流程，这也是架构设计的重要组成部分而非事后附加。他们构建的 LLM Judges、Ground Truth 集和用户模拟器共同形成了一个持续评测闭环，使得每次 Agent 策略变更或模型更新都被及时度量和检验。这种设计选择启示其他团队：在开发 AI 代理时，应当考虑搭建自己的评估基础设施，比如收集真实用户交互作为测试用例、建立自动化评价指标，甚至构建模拟用户来反复 “试探” 新版本的弱点。这种持续反馈机制相当于为 AI 系统加入了监控仪表盘和安全网，在系统演进过程中提供客观依据，避免依赖开发者主观判断，从工程上保障产品质量。

## 5. 训练和推理闭环的结合

传统 Agent 框架往往聚焦于推理过程的 orchestrion（编排），而 Shopify 的设计延伸到了模型训练优化阶段。他们将线上评估信号用于强化学习微调，实现了从评估到模型优化的闭环。这种架构 + 训练一体化的思路对有实力的团队很有借鉴价值：当单纯通过 Prompt 工程难以进一步提升性能时，考虑结合领域反馈进行模型微调，能使 Agent 更贴合特定业务需求。不过，这同时要求有完善的评估和监控手段，以免模型朝错误方向优化（正如前述需要防范奖励函数被钻漏洞）。总的来说，Shopify 的实践提醒我们，生产级的 AI Agent 开发不仅是编排 LLM 调用，还应包括模型性能的持续改进，需要将机器学习训练和传统软件工程有机融合。

# 总结

Shopify 在 Sidekick 中的诸多设计选择 —— 无论是架构上的单 Agent 模块化理念，还是工程流程上的评测反馈闭环 —— 都体现了一种面向生产稳健性的取舍。这些理念将对其他科技公司构建 Agent 系统产生深刻启发：从一开始就以简洁可控的方式集成 LLM 和工具，建立完善的测试监控机制，逐步演进而非一蹴而就，才能打造出可长期维护和信赖的智能代理系统。
