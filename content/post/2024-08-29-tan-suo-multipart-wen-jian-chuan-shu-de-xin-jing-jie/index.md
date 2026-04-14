---
title: "探索 multipart：文件传输的新境界！"
slug: 2024-08-29-tan-suo-multipart-wen-jian-chuan-shu-de-xin-jing-jie
description: "HTTP Multipart 介绍在日常的网络编程和数据传输中，我们经常会遇到“multipart”或“for"
date: 2024-08-29T09:11:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-29-tan-suo-multipart-wen-jian-chuan-shu-de-xin-jing-jie/cover.jpg
original_url: https://mp.weixin.qq.com/s/i6tps8T_eanr86WQD8U4hQ
categories:
  - 系统底层
tags:
  - Python
  - 数据结构
  - 网络
---
### HTTP Multipart 介绍

在日常的网络编程和数据传输中，我们经常会遇到“multipart”或“form-encoded data”这样的术语。尽管这些术语在我日常工作中随处可见，但我却从未真正深入理解或使用过它们，因为 HTTP 库已经为我处理好了这些细节。然而，最近由于在工作中的需求，我不得不深入研究 multipart 的工作原理。我发现，正确地使用 multipart 可以显著提高文件上传的速度并减少内存消耗。接下来，我将详细解释 multipart 的工作原理，希望能帮助你在 HTTP 服务器/客户端中节省时间和内存。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-29-tan-suo-multipart-wen-jian-chuan-shu-de-xin-jing-jie/001-017d96b2.png)

#### 一、什么是 MIME 类型？

在深入探讨 multipart 之前，我们需要先了解什么是 MIME 类型。MIME（Multipurpose Internet Mail Extensions）是一种标准，用于描述文档的性质和格式。简单来说，MIME 类型就是文件的“身份证”，它告诉计算机这个文件是什么类型的，应该用什么样的程序来打开。例如，常见的 MIME 类型有`text/plain`（纯文本）、`image/jpeg`（JPEG 图片）和`application/pdf`（PDF 文档）等。

#### 二、为什么需要使用 Multipart？

在 multipart 出现之前，上传文件的标准是`application/x-www-form-urlencoded`。这种方式要求客户端在上传文件之前对其进行 URL 编码。如果文件主要是 ASCII 文本，URL 编码是高效的；但如果文件主要是二进制数据，那么几乎每个字节都需要进行 URL 转义，这会非常低效。

如果你想上传多个文件而不进行编码，你可以发送多个 HTTP 请求。但这样做的延迟会比在一个请求中发送所有文件更高。为了解决这个问题，1998 年的 RFC 2388 提出了一个新的标准——“multipart/form-data”。这个标准允许你在一个 HTTP 正文中发送多个文件，而无需对它们进行编码。无需编码意味着你可以节省大量的 CPU 周期，并保持总体正文大小较小。

这个协议最初是为从 HTML 表单上传文件而设计的，因此得名。但实际上，你可以使用它从任何你想要的地方上传文件——规范中没有任何部分要求`<form>`或任何 HTML。你可以使用它从任何 HTTP 客户端向任何 HTTP 服务器上传文件。

当你上传文件时，如果你把文件打包成一个 JSON 对象，服务器需要先接收整个 JSON 对象，然后才能开始处理。这样会占用更多内存，而且要等所有文件都上传完毕才能开始处理。

```python
import json
import requests

# 读取多个文件内容
files = ['file1.txt', 'file2.txt', 'file3.txt']
file_contents = {}

for file_name in files:
    with open(file_name, 'r') as file:
        file_contents[file_name] = file.read()

# 将文件内容打包成 JSON 对象
data = {
    'files': file_contents
}

# 将 JSON 对象转换为字符串
json_data = json.dumps(data)

# 上传 JSON 对象到服务器
response = requests.post('http://example.com/upload', data=json_data, headers={'Content-Type': 'application/json'})

print(response.status_code)

```

JSON 格式不支持直接在数据结构中嵌入二进制数据（如图片、视频文件等）。由于 JSON 不能直接包含二进制数据，所以如果你想要通过 JSON 格式来上传一个图片或视频文件，你就需要将这个二进制文件转换成一种可以被 JSON 处理的格式。Base64 就是这样一种格式。

如果你使用 multipart 格式上传，服务器可以一个接一个地接收文件，就像流水一样。这意味着服务器可以更早开始处理第一个文件，而不需要等待其他文件，这样更节省内存，速度也更快。

```python
<!DOCTYPE html>
<html>
<head>
    <title>Multipart Upload Example</title>
</head>
<body>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file1" multiple>
        <input type="file" name="file2" multiple>
        <input type="submit" value="Upload">
    </form>
</body>
</html>

from flask import Flask, request

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_files():
    # 获取名为 file1 和 file2 的文件
    file1 = request.files.get('file1')
    file2 = request.files.get('file2')

    if file1:
        # 处理 file1
        process_file(file1)
    
    if file2:
        # 处理 file2
        process_file(file2)

    return "Files processed successfully!"

def process_file(file):
    # 这里是处理文件的地方
    # 可以将文件保存到磁盘或其他操作
    file.save(file.filename)

if __name__ == '__main__':
    app.run(debug=True)

```

#### 三、Multipart 是什么？

MIME 类型分为两类：离散型和多部分型。离散型包含一个文档，例如`application/`（二进制）、`image/`、`text/`等。多部分型是包含多个部分的文档，这些部分可以有自己的 MIME 类型。有两种多部分类型：`message/`和`multipart/`——是的，有点让人困惑，multipart 既可以是一种类型，也可以是一个类别。`message/`类型基本上不再用于任何东西了，但`multipart/`仍然非常重要。你经常看到`multipart/form-data`用于通过 HTML 表单从 Web 浏览器发送文件到服务器。multipart 中的“part”指的是一个文档。这个类型本可以叫做`multidocument`！

需要注意的是，它并不一定要包含多个文件。它可以只包含一个文件，使用 multipart 进行高效的二进制编码。

#### 四、Multipart 是如何实现的？

如果内容类型是`multipart/form-data`，那么 HTTP 正文中包含多个部分（即文档）。每个部分由一个“边界分隔符”分隔。根 HTTP 消息有一个头部定义了边界分隔符，以便服务器知道每个部分之间的边界在哪里。每个部分也有一些头部：

-   `Content-Disposition`头部定义了每个部分的文件名或包含它的表单字段的名称（仅当你使用实际的 HTML 表单元素时才相关）。
-   `Content-Type`头部定义了每个部分的文件类型（技术上是它们的 MIME 类型，但这两者大致相当）。它默认为`text/plain`。非结构化二进制数据应使用`application/octet-stream`，但如果你知道类型，你应该使用例如`application/zip`、`application/pdf`等。

其他头部不能使用！根据 RFC 7578 的说法：“`multipart/form-data`媒体类型不支持除`Content-Type`、`Content-Disposition`和（在有限情况下）`Content-Transfer-Encoding`之外的任何 MIME 头部字段。其他头部字段不得包含且必须被忽略。”

以下是一个来自 Stack Overflow 的实际示例，展示了 HTTP 正文的样子。这个正文是一个包含 3 个 GIF 的多部分。

```
POST /cgi-bin/qtest HTTP/1.1
Content-Type: multipart/form-data; boundary=2a8ae6ad-f4ad-4d9a-a92c-6d217011fe0f
Content-Length: 514

--2a8ae6ad-f4ad-4d9a-a92c-6d217011fe0f
Content-Disposition: form-data; name="datafile1"; filename="r.gif"
Content-Type: image/gif
GIF87a.D..;
--2a8ae6ad-f4ad-4d9a-a92c-6d217011fe0f
Content-Disposition: form-data; name="datafile2"; filename="g.gif"
Content-Type: image/gif
GIF87a.D..;
--2a8ae6ad-f4ad-4d9a-a92c-6d217011fe0f
Content-Disposition: form-data; name="datafile3"; filename="b.gif"
Content-Type: image/gif
GIF87a.D..;
--2a8ae6ad-f4ad-4d9a-a92c-6d217011fe0f--

```

#### 五、压缩

你可以对整个 Multipart 响应进行 gzip 压缩，但不能选择性地压缩特定部分。这是因为根 HTTP 正文定义了整个消息的压缩头部，包括 multipart 正文中的所有部分。因此，客户端无法告诉服务器“这个特定部分是压缩的，但那个不是”。

如上所述，multipart 的文档中只允许使用 3 个特定的 HTTP 头部——而压缩头部不是其中之一。

#### 六、为什么这很有趣？

所以，“multipart”或“form-encoded data”是一种包含多个文件的 MIME 类型。每个文件都有自己的 MIME 类型和名称。从历史上看，这比上传多个文件的其他方式是一个很大的改进，因为它可以发送原始二进制文件而无需额外的编码或转义。

在我写这篇博客文章之前，我觉得 multipart 有点无聊。它似乎有点过时和落后——我的意思是，它是在 HTML 表单是 Web 技术的前沿时编写的。自从它的 RFC 首次发布以来已经有 25 年了。我们肯定有更好的上传文件的方法了！

但实际上，这在抽象意义上是相当有趣的。它试图有效地组合多个文件上传，而“我们如何将许多文件组合在一起”的问题在计算机科学中总是一个有趣的问题。我喜欢 JSON 的原因之一是它很容易组合。如果每个文件上传是一个 JSON 正文，那么组合它们是微不足道的：只需将 n 个单独的 JSON 正文组合成一个包含 n 个字段的大正文。

但这性能不佳：你必须将文件内容 base64 编码，因为 JSON 只能处理文本，不能处理二进制；服务器必须将整个 JSON 正文缓冲到 RAM 中才能解码。

我认为`multipart/form-data`是试图有效地组合多个文件上传的一种尝试。这种权衡带来了一些复杂性，比如边界和内容处置。我想知道现代解决这个问题的方案会是什么样子。

显然，`multipart/form-data`已经足够好了，因为它到处都在使用。但如果你知道任何解决这个问题的替代方案，请在评论中告诉我！

#### 七、总结

通过本文的介绍，我们可以看到 multipart 在文件上传中的重要性和优势。它不仅提高了文件上传的效率，还减少了内存消耗。尽管 multipart 的设计初衷是为了处理 HTML 表单中的文件上传，但它的应用范围远不止于此。无论是 Rust 还是其他编程语言，都可以利用 multipart 来实现高效、稳定的文件传输。

在实际应用中，我们可以通过选择合适的库和框架来简化 multipart 的处理过程。例如，在 Rust 中，我们可以使用 axum 或 reqwest 等库来轻松处理 multipart 请求。这些库提供了丰富的功能和良好的性能，可以帮助我们快速构建高效、可靠的文件上传功能。

此外，了解 multipart 的工作原理也有助于我们更好地优化和调整文件上传的策略。例如，我们可以通过调整边界分隔符的选择、优化 Content-Disposition 和 Content-Type 头部的设置等方式来提高文件上传的效率和稳定性。

最后，虽然 multipart 已经存在了很长时间，但它仍然是一个值得深入研究和探讨的话题。随着网络技术的不断发展和进步，我们可能会遇到更多新的挑战和需求。因此，持续学习和探索新的技术和方法是非常重要的。

希望本文能为你提供一些关于 multipart 的有价值的信息和启发。如果你有任何疑问或建议，请随时在评论区留言交流。
