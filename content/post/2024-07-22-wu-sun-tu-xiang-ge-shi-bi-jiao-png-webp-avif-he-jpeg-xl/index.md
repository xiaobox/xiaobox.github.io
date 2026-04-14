---
title: "无损图像格式比较：PNG、WebP、AVIF 和 JPEG XL"
slug: 2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl
description: "在数字时代，图像质量和压缩效率成为了关键问题。"
date: 2024-07-22T06:17:58.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/cover.jpg
original_url: https://mp.weixin.qq.com/s/XgqSxxhXuw_slD3FXBDvBA
categories:
  - 工具与效率
tags:
  - JavaScript
  - Chrome
  - 算法
---
在数字时代，图像质量和压缩效率成为了关键问题。本文对比了四种主流的无损图像格式：`PNG`、`WebP`、`AVIF` 和 `JPEG XL`，探讨它们在压缩效率、编码速度和使用场景等方面的优劣。

## 什么是无损压缩？

无损压缩是一种在不损失任何数据的情况下减少文件大小的方法。常见的无损压缩格式包括 `ZIP` 和 `RAR`。在 Web 环境中，`GZIP` 压缩通常用于缩小 JavaScript 和 CSS 文件。在图像压缩领域，`PNG` 是一种广为人知的无损格式。

无损压缩的替代方法是有损压缩，在压缩照片时经常使用。`JPEG` 可能是最著名的有损图像格式。有损压缩会丢弃图像中的一些细节，从而导致文件大小显著减小。由于大照片太大而无法传输和存储，因此损失一些质量通常是一个很好的权衡。

## 何时使用无损压缩？

虽然像 `JPEG` 和 `WebP` 这样的有损图像格式对照片来说很好，但对图形来说就不那么好了。压缩失真（如块效应和模糊）在这类图像上很容易看出来。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/001-99b3c9f2.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/002-e1aa8f5a.png)

无损图像压缩在处理包含大量连续颜色区域的图像时效果最佳，比如标志、截图、图表和图形。这类图像用无损压缩算法压缩往往能得到更小的文件大小，同时保持高质量。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/003-87fbf56a.png)

无损压缩效果良好的图像示例。`PNG` 形式的回收符号占用 3 KB。相同文件大小的 `JPEG` 具有明显的压缩失真。具有最高质量的 `JPEG` 看起来与 `PNG` 相同，但大小是 `PNG` 的八倍。

### PNG

PNG （Portable Network Graphics） 即便携式网络图形。

是一种老牌的无损图像格式，于1996年首次发布。它作为 GIF 格式的替代品出现，具有许多优势，如支持 24 位颜色和透明通道。PNG 使用 DEFLATE 压缩算法，并支持多种压缩优化工具，如 PNGOUT、OptiPNG 和 OxiPNG。

所有浏览器都支持 PNG 格式。

### WebP

Google 于 2010 年推出了基于 VP8 视频编解码器的 WebP 作为有损图像格式。2012年发布的WebP 0.3引入了无损模式，与VP8编解码器无关。有损 WebP 仅限于 4:2:0 色度子采样，会丢弃一些颜色信息，而无损 WebP 将保留所有原始图像数据。

直到 2020 年，Apple 的 Safari 浏览器还是唯一抵制 WebP 的浏览器。不过到了 2021 年，所有主要浏览器均支持 WebP。

### AVIF

AVIF 代表 AV1 图像文件格式。它是一种新的图像格式，基于 AV1 视频编解码器。它具有许多高级功能，例如支持高位深度和 HDR。该格式支持无损和有损压缩。

最新版本的 Google Chrome 支持 AVIF，并且可以通过使用配置标志在 Firefox 中启用。

### JPEG XL JPEGXL

JPEG XL 是一种即将推出的新图像格式。JPEG XL 是通过结合两种现有的图像格式而开发的，即 Google 开发的 Pik 图像格式和 Cloudinary 开发的 FUIF（免费通用图像格式）。

Chrome 和 Firefox 支持 JPEG XL，但默认情况下不启用。必须使用功能标志来启用对该格式的支持。

## 对比结果

### 文件大小

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/004-ae0818a6.png)

### 编码速度

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/005-257a5462.png)

## 总结

从测试结果来看，与最优化的 PNG 相比，大多数现代无损图像格式（例如 WebP 和 JPEG XL）在效率上都有很大提高。

### png

使用 OxiPNG 优化 PNG 可以使它们稍微小一些，大约 12%，这并不是一个很大的差异。OxiPNG 速度非常快，处理一张图像只需大约 700 毫秒。

将 Zopfli 设置与 OxiPNG 结合使用会使优化速度极其缓慢，平均需要大约 208 秒或三分半钟。与原始 PNG 相比，生成的文件大约小 18%。我不建议使用 Zopfli 压缩，因为它需要花费大量时间并且只能提供稍小的文件。WebP 或 JPEG XL 等较新的格式生成的文件要小得多，而且编码时间只是 Zopfli 的一小部分。

由于 PNG 优化收益如此之小，并且该过程需要如此多的时间，因此如果能够使用更现代的格式，那么优化 PNG 文件可能根本不值得。即使未经优化，PNG 仍然是源图像格式的不错选择，因为它与图像编辑器和内容管理系统等大多数软件兼容。

你可以将原始 PNG 文件转换为更有效的格式，然后再向最终用户显示。对于无法显示现代格式的客户端（例如某些电子邮件客户端和旧浏览器），PNG 也可以是一种有用的后备格式。

### webp

WebP 是无损图像的不错选择，因为它在压缩效率方面轻松胜过 PNG，平均图像小 41%。它也得到网络浏览器和其他软件的广泛支持。WebP 文件的编码速度也很快，压缩仅需约 3 秒。

### AVIF

不得不说，我对 AVIF 的表现有点失望。虽然有损 AVIF 确实需要很长时间来压缩，但与 JPEG 和 WebP 相比，它具有出色的压缩效果。不幸的是，无损 AVIF 却并非如此。

在无损模式下，编码 AVIF 文件平均需要 30 秒，但与其他竞争格式相比，结果并不好。平均减少约 20%，生成的文件大小与使用 Zopfli 的 OxiPNG 相当，但与 WebP 或 JPEG XL 相比明显更大。使用 AVIF 时，我会坚持使用该格式效果最好的有损压缩。

### JPEG XL

JPEG XL 是新近出现的格式，给人留下了深刻的印象。平均文件大小减少约 48%，略优于 WebP。从第 75 个百分位数来看，JPEG XL 比 WebP 具有优势，这意味着 JPEG XL 在处理难以压缩的复杂图像方面做得更好。

然而这个兼容性吧。。。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-22-wu-sun-tu-xiang-ge-shi-bi-jiao-png-webp-avif-he-jpeg-xl/006-aba5f756.png)
