---
title: "HTML 中的 <template> 元素：提升动态网页的最佳工具"
slug: 2024-08-10-html-zhong-de-template-yuan-su-ti-sheng-dong-tai-wang-ye-de-
description: "在现代网页开发中，动态内容的生成和管理是一个重要的方面。为了简化这一过程，HTML5 引入了一个非常实用的元素——<template>。"
date: 2024-08-10T05:18:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-html-zhong-de-template-yuan-su-ti-sheng-dong-tai-wang-ye-de-/cover.jpg
original_url: https://mp.weixin.qq.com/s/-ggglxFN0nO0UrNTodCEbQ
categories:
  - 工具与效率
tags:
  - JavaScript
  - Docker
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-html-zhong-de-template-yuan-su-ti-sheng-dong-tai-wang-ye-de-/001-8c0b4ed5.png)

在现代网页开发中，动态内容的生成和管理是一个重要的方面。为了简化这一过程，HTML5 引入了一个非常实用的元素——`<template>`。它为我们提供了一种灵活且高效的方式来管理和插入复杂的 HTML 结构。

## 什么是 `<template>` 元素？

简单来说，`<template>` 元素是用来存储 HTML 片段的，这些片段在初始加载时并不呈现。它们仅在需要时才会被克隆并插入到 DOM 中。与普通隐藏元素不同，`<template>` 元素的内容是惰性的，这意味着其中的图片不会加载，脚本不会执行，样式也不会应用。

### 为什么使用 `<template>` 元素？

在许多情况下，我们需要在网页加载后动态地添加复杂的 HTML 结构。如果完全依赖 JavaScript 来创建这些结构，可能会导致代码繁琐、复杂，尤其是当结构包含多个嵌套元素和属性时。

以下是一个使用 `<template>` 元素的简单示例：

```html
<template id="burger-template">
  <button type="button" aria-expanded="false" aria-label="Menu" aria-controls="mainnav">
    <svg width="24" height="24" aria-hidden="true">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z">
    </svg>
  </button>
</template>

```

在这个例子中，我们定义了一个存储按钮的模板。这个按钮只有在 JavaScript 运行时才会被插入到页面中，从而保持页面的语义分离和代码的简洁性。

## 如何使用 `<template>` 元素？

使用 `<template>` 元素非常简单。首先，我们在 HTML 中定义一个模板元素，并赋予它一个唯一的 ID。然后，在 JavaScript 中，我们可以通过以下步骤来克隆和插入模板内容：

```
const template = document.querySelector('#burger-template');
const content = template.content.cloneNode(true);
container.append(content);

```

通过这种方式，我们可以将模板的内容克隆到指定的容器中。值得注意的是，这一过程不仅限于单次使用。您可以根据需要多次克隆和插入模板内容。

### 实际应用中的例子

在实际开发中，`<template>` 元素被广泛用于创建动态列表、表格行、交互式组件等。例如，在 Sass Guidelines 网站中，使用模板来动态注入 GitHub 链接，以便用户可以直接编辑视图或每个章节。这些链接原本应该始终存在，但由于该网站是由 Markdown 文件构建的，因此需要通过 JavaScript 动态生成。

## 浏览器支持情况

令人惊讶的是，几乎 98% 的现代浏览器都支持 `<template>` 元素。因此，在大多数情况下，您可以放心使用这一功能。如果您需要兼容旧版浏览器，可以通过以下方式检测支持情况：

```
if ('content' in document.createElement('template')) {
  // `<template>` 受支持。
}

```

## 为什么不使用隐藏元素？

有读者可能会问，为什么不直接使用隐藏的 DOM 元素，例如 `<div>`，来存储模板内容呢？

虽然这两者在某种程度上看似相似，但使用 `<template>` 元素有几个显著优势：

1.  **惰性加载**：与隐藏的容器不同，`<template>` 的内容不会自动加载。这意味着其中的图片和脚本不会被执行，从而提高了页面性能。

2.  **灵活性**：`<template>` 可以包含任何 HTML 结构，而无需考虑 HTML 验证器的限制。例如，您可以在 `<template>` 中包含 `<td>`、`<li>` 或 `<dd>` 等元素，而这些元素通常要求特定的父元素。

3.  **语义性**：`<template>` 是专门为存储模板设计的，因此它在语义上更为清晰，尤其是对于第三方工具和扩展来说。

4.  **安全性**：使用 CSS 隐藏元素并不可靠，因为 CSS 可能被禁用或覆盖。而 `<template>` 元素总是默认隐藏，即使在没有 CSS 的情况下也能保持其不可见性。

5.  **SEO 考虑**：搜索引擎可能会索引通过 CSS 隐藏的内容，这可能导致不必要的模板数据被索引。而使用 `<template>` 则无需担心这一问题。

## 总结

总的来说，HTML 的 `<template>` 元素为开发者提供了一种高效管理动态内容的方法。对于简单的节点操作，我们可以使用内置的 DOM 操作方法，但对于更复杂的结构，使用 `<template>` 无疑是更好的选择。

希望本文能帮助您更好地理解和应用 `<template>` 元素。如果您有任何问题或建议，欢迎在评论区与我们分享！
