---
title: "一文讲透 GoF 的 23 种设计模式之工厂方法"
slug: 2026-02-27-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-gong-chan
description: "一文讲透 GoF 的 23 种设计模式之工厂方法工厂方法（Factory Method） 是创建型模式定义用一"
date: 2026-02-27T23:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-02-27-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-gong-chan/cover.jpg
original_url: https://mp.weixin.qq.com/s/R4ipS6AX6O-QUqbrYheTNg
categories:
  - 架构与方法
tags:
  - Java
  - LLM
  - Claude
  - Agent
  - Prompt
  - 设计模式
---
# 一文讲透 GoF 的 23 种设计模式之工厂方法

工厂方法（Factory Method） 是创建型模式

## 定义

**用一句话概括工厂方法模式：定义一个用于创建对象的接口，让子类决定实例化哪一个类。 它让类的实例化推迟到了子类。**

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-02-27-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-gong-chan/001-00e336ad.png)

## 简单工厂

了解工厂方法模式前，我们先了解下简单工厂，既然叫简单工厂，那自然很 “简单”。

它的核心思想非常直接：专门定义一个类（包揽大权），通过接收不同的参数，用 switch 或 if-else 来决定创建并返回哪一种具体的产品实例。

假设我们在开发一个 AI 应用，需要根据不同场景创建不同类型的 AI Agent（比如负责对话的 Agent，和负责处理数据的 Agent）。

### 第一步：定义产品的共同接口和具体实现

```java
⚡ java片段// 1. 抽象产品
public interface AIAgent {
    voidexecuteTask();
}

// 2. 具体产品 A：聊天助理
publicclass ChatAgent implements AIAgent {
    @Override
    publicvoidexecuteTask() {
        System.out.println("ChatAgent: 正在与用户进行自然语言对话...");
    }
}

// 2. 具体产品 B：数据分析助理
publicclass DataAnalysisAgent implements AIAgent {
    @Override
    publicvoidexecuteTask() {
        System.out.println("DataAnalysisAgent: 正在提取并分析核心数据...");
    }
}

```

### 第二步：创建“简单工厂”类

```
⚡ java片段// 3. 简单工厂类 (通常使用静态方法)
publicclass AIAgentFactory {
    
    // 根据传入的类型参数，决定实例化哪个具体的 Agent
    publicstatic AIAgent createAgent(String agentType) {
        if ("chat".equalsIgnoreCase(agentType)) {
            return new ChatAgent();
        } elseif ("data".equalsIgnoreCase(agentType)) {
            return new DataAnalysisAgent();
        } else {
            throw new IllegalArgumentException("未知的 Agent 类型: " + agentType);
        }
    }
}

```

### 第三步：客户端调用

```java
⚡ java片段public class Client {
    public static void main(String[] args) {
        // 客户端不需要知道 ChatAgent 和 DataAnalysisAgent 是怎么被 new 出来的
        // 只需要告诉工厂：“给我一个 chat 类型的 Agent”
        AIAgent agent1 = AIAgentFactory.createAgent("chat");
        agent1.executeTask();

        AIAgent agent2 = AIAgentFactory.createAgent("data");
        agent2.executeTask();
    }
}

```

结合代码，我们可以很直观地看到它的特点：

●优点（省事、解耦）：客户端彻底和具体的实现类解耦了。你不需要在业务代码里到处写 new ChatAgent()，把“创建对象”的脏活累活全交给了工厂。

●缺点（牵一发而动全身）：它严重违反了“开闭原则”（对扩展开放，对修改关闭）。假设我们现在要引入一个新的 CodingAgent（写代码助手），除了要新建产品类，你必须去修改 AIAgentFactory 里面的 if-else 代码。一旦产品种类极其庞大，这个工厂类就会变得非常臃肿且难以维护。

正是为了解决简单工厂“违反开闭原则”的这个致命缺点，才演进出了工厂方法模式（把这一个大工厂，拆成了一个个不用改代码、只需新增的具体小工厂）。

## 工厂方法模式的结构与角色

工厂方法模式主要包含四个角色：

●抽象产品 (Product)：定义产品的统一接口。

●具体产品 (Concrete Product)：实现抽象产品接口的具体类。

●抽象工厂 (Creator)：声明返回产品对象的工厂方法。

●具体工厂 (Concrete Creator)：重写工厂方法，返回具体的实例化产品

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-02-27-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-gong-chan/002-5fb65f39.png)

## Java 代码实现

### 1. 定义产品（大模型客户端）

```java
⚡ java片段// 抽象产品：统一的大模型调用接口
public interface LLMClient {
    String generate(String prompt);
}

// 具体产品 A：Claude 客户端
publicclass ClaudeClient implements LLMClient {
    private String modelVersion;
    
    publicClaudeClient(String modelVersion) { this.modelVersion = modelVersion; }

    @Override
    public String generate(String prompt) {
        return"[Claude " + modelVersion + "] 思考并返回结果...";
    }
}

// 具体产品 B：OpenAI 客户端
publicclass OpenAIClient implements LLMClient {
    private String endpoint;
    
    publicOpenAIClient(String endpoint) { this.endpoint = endpoint; }

    @Override
    public String generate(String prompt) {
        return"[OpenAI API] 处理输入并返回结果...";
    }
}

```

### 2. 定义创建者（核心：业务骨架 + 工厂方法）

这里是关键：AgentWorkflow 不是一个纯粹的“工厂类”，它是业务类，工厂方法只是它的一部分。

```java
⚡ java片段// 抽象创建者：Agent 工作流骨架
public abstract class AgentWorkflow {

    // 核心业务逻辑：定义了标准的处理流程（这其实也是个模板方法）
    publicvoidprocessTask(String taskContext) {
        System.out.println("=== 1. 解析任务上下文，提取关键信息 ===");
        
        // 【灵魂所在】：这里调用工厂方法，拿到一个产品对象。
        // 父类在此刻完全不知道自己拿到的是 Claude 还是 OpenAI。
        LLMClient client = createLLMClient();
        
        System.out.println("=== 2. 请求大模型进行推理 ===");
        String result = client.generate(taskContext);
        
        System.out.println("=== 3. 结果后处理并落库 ===\n" + result + "\n");
    }

    // 【工厂方法】：将实例化具体产品的职责，推迟到子类去实现
    protected abstract LLMClient createLLMClient();
}

```

### 3. 定义具体创建者（子类重写工厂方法）

```java
⚡ java片段// 具体创建者 A：基于 Claude 的工作流
publicclass ClaudeAgentWorkflow extends AgentWorkflow {
    @Override
    protected LLMClient createLLMClient() {
        // 这里封装 Claude 特有的复杂初始化逻辑（比如加载凭证、设置代理等）
        System.out.println("  -> [工厂方法] 正在初始化 Claude 客户端环境...");
        return new ClaudeClient("3.5-Sonnet");
    }
}

// 具体创建者 B：基于 OpenAI 的工作流
publicclass OpenAIAgentWorkflow extends AgentWorkflow {
    @Override
    protected LLMClient createLLMClient() {
        System.out.println("  -> [工厂方法] 正在构建 OpenAI 客户端环境...");
        return new OpenAIClient("https://api.openai.com/v1");
    }
}

```

### 4. 客户端调用

```java
⚡ java片段public class Client {
    publicstaticvoidmain(String[] args) {
        String task = "编写一段 Python Web 框架对比报告";

        // 场景 1：启动基于 Claude 的 Agent 工作流
        AgentWorkflow claudeWorkflow = new ClaudeAgentWorkflow();
        claudeWorkflow.processTask(task);

        // 场景 2：切换为基于 OpenAI 的 Agent 工作流
        AgentWorkflow openaiWorkflow = new OpenAIAgentWorkflow();
        openaiWorkflow.processTask(task);
    }
}

```

如果你回看之前的例子，你会发现这个 Demo 解决了一个架构设计上的核心痛点：控制反转 (IoC) 的雏形。

在 AgentWorkflow 这个父类中，业务主流程已经被彻底固化并复用（processTask 方法）。如果在未来，业务需求要求你接入一个全新的本地开源模型（比如 DeepSeek），你不需要修改任何现有的主流程代码，只需要：

●新建一个 DeepSeekClient（实现 LLMClient）。

●新建一个 DeepSeekAgentWorkflow，重写 createLLMClient() 方法返回这个新 Client。

这才是工厂方法模式真正强大的地方：它是为了让高层模块（业务骨架）能够独立于底层模块（具体产品）的创建而存在，从而支撑起大型框架的扩展性。 JDK 里的 Iterable 接口和它的 iterator() 方法，本质上就是这种工厂方法模式的经典体现。

## 什么时候用?

●你写的“父类流程”需要创建某种对象，但父类不该/不想知道具体类是谁（框架留扩展点的典型方式）。

●你希望通过继承覆写来扩展“产物类型”，让调用方不动、流程不动。

一些具体的场景：

●框架扩展点：工厂方法很常见于“框架规定流程、业务方覆写创建”的场景（你写子类接入框架）。

●Spring 的 FactoryBean：它的语义就是“这个 bean 不是普通 bean，而是用来生产另一个对象的”，并且暴露的是 getObject() 创建出来的对象。

●Java ServiceLoader：通过 SPI 在运行时发现/加载实现类，属于“把具体实现延迟到运行时配置/部署”的一类机制，和“解耦创建与使用”的目标一致。

## 注意模式的命名

我们回头看一下这个模式为什么叫 **Factory Method**，而不是干脆叫 Factory ?  这个命名是有讲究的。

核心原因在于：这个模式的灵魂是一个“方法”，而不是一个“类”。

1.“工厂 (Factory)”是一个通俗的广义概念：

在日常沟通中，只要一个类的主要职责是造对象，我们都叫它工厂（比如前面提过的“简单工厂”，它就是一个充斥着 if-else 的具体类）。

2.“工厂方法 (Factory Method)”强调的是面向对象中的“多态”与“继承”：

在 GoF 的定义中，创建对象的逻辑并不是封装在一个独立的、包揽大权的“工厂类”里，而是定义在了一个普通业务类（Creator）的内部，作为一个抽象方法存在。

●这个模式的精髓是：父类定义业务骨架，把其中“需要实例化具体对象”的那一步，挖空成一个方法（也就是 Factory Method）。

●具体的实例化工作，**推迟（Defer）到了子类去重写这个方法**来实现
