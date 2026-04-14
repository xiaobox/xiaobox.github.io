---
title: "Modern MD Editor 项目介绍"
slug: 2025-08-16-modern-md-editor-xiang-mu-jie-shao
description: "Modern MD Editor 是一款面向创作者与内容团队的「高颜值 Markdown 编辑器 + 社交平台发布器」。"
date: 2025-08-16T03:45:30.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/cover.jpg
original_url: https://mp.weixin.qq.com/s/xVDxMq9fQio5-_g06UYumA
categories:
  - 工具与效率
---
# 感谢

自 `mdeditor` 项目开源以来，陆续收到了大家的许多反馈，有提建议的、有提 bug 的，每一条评论我都认认真真地看了。

项目也得到了 阮一峰大佬的 **科技爱好者周刊** 的支持，在最新的一期周刊（https://github.com/ruanyf/weekly/blob/master/docs/issue-361.md）进行了推荐

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/001-88c0b3e9.png)

开源一周目前项目在 github 上也获得了 160+  star

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/002-0a729972.png)

非常感谢大家对项目的关注和支持。 🙏

# 回复疑问

在上篇文章的评论中很多网友说为什么不多介绍一下项目，哪怕放一张图出来?

其实这与我做这个项目的初衷有关系。

## 初衷

我是个开发者，同时也是内容创作者，平时会写公众号文章，文章内容是用 markdown 写的。目前市面上比较流行好用的 markdown 编辑器都用过，后来就只用 mdnice 和 md  这些了，因为他们对社交媒体友好，可以将预设的样式一键 copy 到微信公众号，很方便。

但这些工具我用的时间久了觉得总是不如我的意，比如我想设置颜色、间距、字号什么的，这些工具用起来总是不顺手。无论是 UI 样式还是功能设置，我都不那么满意，于是就越来越想做个让自己舒服、满意的工具。

这就是做这个项目的初衷，完全为了服务我自己，完全按照我自己的审美和功能取向来设计与开发的一个 markdown 编辑器。

开源的原因是我想可能也会有其他创作者有我类似的需求，也许能解决大家的问题就开源了，便人便已。

最开始也真没当回事儿，而且不想占太大篇幅来宣传，现在网上的信息太多了，很多人都信息过载，我想我就别添乱了，就没放图，也没怎么详细介绍。还有个原因是，其实项目的 readme 写的很清楚了，大家一看便知。

# 有必要展开说说

这几天随着关注项目的人数增多，通过大家反馈的意见，我觉得还是有必要再详细介绍一下项目。主要原因有以下几个：

●很多网友访问不了 github，看不到介绍（目前我也同步到了 gitee 一份，文末有地址）

●一图胜千言，颜值党很关注 UI

●一些在 readme 没说透的话，可以再细说说

所以，我借此机会就给大家展开介绍一下，如果已经了解过项目的朋友可以跳过了。

# 功能介绍

## 主界面

### 编辑 + 预览双栏

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/003-afcc3601.png)

**除了常规的 markdown 语法外，还支持 `mermaid`**

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/004-b92846e2.png)

### 预览窗口（桌面 / 平板 / 手机）

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/005-c7d47c41.png)

## 设置

设置页面目前可以设置的项目有：

●主题系统

●主题色

●代码样式

●字体

●字号

●间距

### 主题系统

目前有两个主题系统，一个是默认的，一个是 `清风排版` ，我个人最喜欢后者，后续我将开发更多的主题系统，每个主题系统都是一套完全不同的样式风格。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/006-331beee3.png)

### 主题色

预设了 8 个主题色

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/007-01ed6c72.png)![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/008-30d8b37f.png)

也可以自定义设置颜色

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/009-16d04f06.png)

也支持 `color picker`,除了内置颜色，可以选取你看到的任何颜色

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/010-cc479e7e.png)

颜色选择并应用后，整个系统页面和 markdown 编辑器样式都会被应用，有一种统一感。

### 代码样式

预设了四种我喜欢的、常规的样式

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/011-084c1e4f.png)

### 字体

字体的选择如图所示

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/012-a4f3d121.png)

### 字号

可以从小到大，方便地选择你需要的字号大小，应用后在预览页以及复制到公众号以后都会变化

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/013-a48225cc.png)

### 间距

与字号设置类似，支持字间距和行间距

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/014-8547ae2f.png)

## 一键复制

支持一键复制到微信公众号

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-16-modern-md-editor-xiang-mu-jie-shao/015-843e2926.png)

# 安装和部署

## Docker 一键部署

### 方式一：Docker（推荐最简）

```bash
$ terminal# 拉取并运行（默认暴露到本机 8080）
docker run -d --name mdeditor -p 8080:80 helongisno1/mdeditor:latest

# 访问
open http://localhost:8080

```

### 方式二：Docker Compose

```yaml
$ terminalversion: "3.9"
services:
  mdeditor:
    image: helongisno1/mdeditor:latest
    ports:
      - "8080:80"
    restart: unless-stopped

$ terminaldocker compose up -d
open http://localhost:8080

```

## 安装与本地运行

```bash
$ terminal# 克隆
git clone https://github.com/xiaobox/mdeditor.git
cd modern-md-editor

# 安装依赖（任选其一）
npm install
# 或
yarn
# 或
pnpm install

# 本地开发
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview

# 测试（可选）
npm run test
npm run test:ui
npm run test:coverage

```

# 后续规则

目前是想先把大家关注的一些功能做完，比如：

●所见即所得

●导入导出

当然还有 bug 修复，大家如果有类似 bug 或 功能方面的意见，欢迎 到 github 中提 issue

## 补充信息

Modern MD Editor 是一款面向创作者与内容团队的「高颜值 Markdown 编辑器 + 社交平台发布器」。它以极致的界面与交互为基础，提供所见即所得的实时预览与多端视口切换，并通过一键复制将 Markdown 转为适配微信公众号/社交平台的高保真富文本（自动内联样式、字体/行高/字距与主题化适配），让创作到发布的最后一步变得优雅、高效、可控。

### 项目地址

| 平台 | 地址 |
| --- | --- |
| **GitHub** | https://github.com/xiaobox/mdeditor |
| **Gitee** | https://gitee.com/xiao-box/mdeditor |
