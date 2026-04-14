---
title: "Kimi K2.5 模型接入 Claude Code 完全指南"
slug: 2026-01-28-kimi-k2-5-mo-xing-jie-ru-claude-code-wan-quan-zhi-nan
description: "Kimi K2.5 模型接入 Claude Code 完全指南Claude Code 是 Anthropic"
date: 2026-01-28T08:20:02.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-28-kimi-k2-5-mo-xing-jie-ru-claude-code-wan-quan-zhi-nan/cover.jpg
original_url: https://mp.weixin.qq.com/s/8snk7J28FDIWEGy5x3D5DA
categories:
  - AI
tags:
  - Linux
  - macOS
  - Claude
---
# Kimi K2.5 模型接入 Claude Code 完全指南

Claude Code 是 Anthropic 推出的官方命令行工具，让开发者能够在终端中与 Claude AI 进行交互式编程。通过简单的环境变量配置，你可以将 Claude Code 的后端从默认的 Claude 模型切换到 Kimi K2.5 模型，享受更强大的中文理解和代码生成能力。

本文将详细介绍如何在 macOS、Linux 和 Windows 系统上完成配置，让你能够快速开始使用 Kimi K2.5 驱动 Claude Code。

* * *

## 准备工作

在开始配置之前，请确保你已经完成以下准备工作：

1.**安装 Claude Code**：如果尚未安装，请参考 Anthropic 官方文档 进行安装

2.**获取 Kimi API Key**：前往 Kimi 开放平台 注册账号并获取 API Key

3.**确认终端环境**：确保你使用的是 bash、zsh 或 PowerShell 等常见 shell

* * *

## 核心配置项

将 Kimi K2.5 接入 Claude Code 需要配置三个关键环境变量：

| 环境变量 | 说明 | 值 |
| --- | --- | --- |
| `ANTHROPIC_BASE_URL` | API 基础地址 | `https://api.kimi.com/coding/` |
| `ANTHROPIC_API_KEY` | 你的 Kimi API 密钥 | `sk-kimi-xxxxxxxx` |
| `ANTHROPIC_MODEL` | 使用的模型名称 | `kimi-for-coding` |

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-28-kimi-k2-5-mo-xing-jie-ru-claude-code-wan-quan-zhi-nan/001-98f88421.png)

* * *

## macOS / Linux 配置方法

### 方法一：临时配置（当前终端会话）

如果你只想在当前终端会话中使用 Kimi K2.5，可以直接执行以下命令：

```
⚡ bash片段export ANTHROPIC_BASE_URL=https://api.kimi.com/coding/
export ANTHROPIC_API_KEY=sk-kimi-*************************
export ANTHROPIC_MODEL=kimi-for-coding

```

配置完成后，启动 Claude Code：

⚡ bash片段`claude`

> **注意**：这种方式只在当前终端窗口有效，关闭窗口后配置会失效。

### 方法二：永久配置（推荐）

为了让配置在每次打开终端时自动生效，你需要将环境变量添加到 shell 配置文件中。

#### 1. 确定你的 shell 类型

⚡ bash片段`echo $SHELL`

●如果输出 `/bin/zsh`，使用 **~/.zshrc**

●如果输出 `/bin/bash`，使用 **~/.bashrc** 或 **~/.bash\_profile**

#### 2. 编辑配置文件

使用你喜欢的编辑器打开配置文件：

```
⚡ bash片段# 对于 zsh 用户
nano ~/.zshrc

# 对于 bash 用户
nano ~/.bashrc

```

#### 3. 添加环境变量

在文件末尾添加以下内容：

```
⚡ bash片段# Kimi K2.5 for Claude Code
export ANTHROPIC_BASE_URL=https://api.kimi.com/coding/
export ANTHROPIC_API_KEY=sk-kimi-**********************************
export ANTHROPIC_MODEL=kimi-for-coding

```

#### 4. 保存并生效

保存文件后，运行以下命令使配置生效：

```
⚡ bash片段# 对于 zsh 用户
source ~/.zshrc

# 对于 bash 用户
source ~/.bashrc

```

#### 5. 验证配置

⚡ bash片段`echo $ANTHROPIC_MODEL`

如果输出 `kimi-for-coding`，说明配置成功。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-28-kimi-k2-5-mo-xing-jie-ru-claude-code-wan-quan-zhi-nan/002-187e4585.png)

* * *

## Windows 配置方法

### 方法一：PowerShell 临时配置

```
⚡ powershell片段$env:ANTHROPIC_BASE_URL = "https://api.kimi.com/coding/"
$env:ANTHROPIC_API_KEY = "sk-kimi-*************************"
$env:ANTHROPIC_MODEL = "kimi-for-coding"

```

### 方法二：系统环境变量（永久配置）

1.按 `Win + R`，输入 `sysdm.cpl` 打开系统属性

2.点击 **高级** → **环境变量**

3.在 **用户变量** 区域点击 **新建**，添加以下三个变量：

| 变量名 | 变量值 |
| --- | --- |
| `ANTHROPIC_BASE_URL` | `https://api.kimi.com/coding/` |
| `ANTHROPIC_API_KEY` | `sk-kimi-*********************` |
| `ANTHROPIC_MODEL` | `kimi-for-coding` |

1.点击 **确定** 保存

2.**重启终端** 使配置生效

### 方法三：PowerShell 配置文件

在 PowerShell 中执行：

```
⚡ powershell片段# 创建配置文件（如果不存在）
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -Type File -Force
}

# 添加环境变量
Add-Content $PROFILE "`n$env:ANTHROPIC_BASE_URL = 'https://api.kimi.com/coding/'"
Add-Content $PROFILE "`n$env:ANTHROPIC_API_KEY = 'sk-kimi-*************************'"
Add-Content $PROFILE "`n$env:ANTHROPIC_MODEL = 'kimi-for-coding'"

```

* * *

## 验证连接

配置完成后，启动 Claude Code 并验证是否成功连接到 Kimi K2.5：

⚡ bash片段`claude`

在 Claude Code 中，输入 `/model` 查看当前使用的模型：

如果返回的信息中包含 Kimi 或 kimi-for-coding，说明配置成功。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-28-kimi-k2-5-mo-xing-jie-ru-claude-code-wan-quan-zhi-nan/003-ed1fab23.png)
