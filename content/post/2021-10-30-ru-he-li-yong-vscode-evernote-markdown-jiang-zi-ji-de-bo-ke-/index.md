---
title: "如何利用 VsCode + evernote + markdown 将自己的博客自动同步成笔记"
slug: 2021-10-30-ru-he-li-yong-vscode-evernote-markdown-jiang-zi-ji-de-bo-ke-
description: "在 VsCode 中安装 evermonkey 插件在 VsCode 中找到 evermonkey 插件，安"
date: 2021-10-30T11:13:19.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-30-ru-he-li-yong-vscode-evernote-markdown-jiang-zi-ji-de-bo-ke-/cover.jpg
original_url: https://mp.weixin.qq.com/s/GNwRQJfeVQrt32NZBDJthw
categories:
  - 工具与效率
tags:
  - Java
  - VSCode
  - 缓存
---
## 在 VsCode 中安装 evermonkey 插件

1.  在 VsCode 中找到 evermonkey 插件，安装

2.  command + shift + p ，输入 ever token。显示 “open developer page to get API token”，选择它。

3.  会让你选择 china 和 international 两个选择，选择 china. 接着会打开默认浏览器的一个界面。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-30-ru-he-li-yong-vscode-evernote-markdown-jiang-zi-ji-de-bo-ke-/001-868fe96a.jpg)

4.  先生成你自己的 token, 然后回到 VsCode 打开设置找到如下图的设置，把刚才生成好的内容填写进去。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-30-ru-he-li-yong-vscode-evernote-markdown-jiang-zi-ji-de-bo-ke-/002-17248a8d.jpg)

5.  到这里一般就好了，不过谨慎起见还是重启一下 Vscode.

## 使用插件

command + shift + p 后输入 ever new 就可以创建一个文件，文件格式如下：

`---   title:    tags:    notebook:    ---      `

这是文件头，即给 evernote 做的笔记标识：标题、tag、笔记本。后面的就是你的 markdown 笔记内容了。

写完内容后，command + shift + p 后输入 ever publish 就可以发布到 evernote 了。

## 命令列表

还有上面没介绍过的，这里列举一下。

使用 新建笔记 -- ever new打开命令面板 (F1 或者 ctrl + shift +p), 输入 ever new 即可新建一个空白笔记，文档顶部是笔记元数据，包括笔记的标题，标签，所属笔记本等（不支持分级）。当输入笔记本和标签时，如果是已经存在的，则会有代码补全提示，否则将会在印象笔记中新建。标签需要用半角逗号分隔。

打开笔记 -- ever open打开命令面板，输入 ever open 即可以树形结构打开印象笔记。打开后，默认会将笔记的内容转换为 markdown 格式，如果有不支持的媒体格式，那么转换后可能会影响笔记的内容。因此建议使用小猿完成纯文本编辑操作。

搜索笔记 -- ever search打开命令面板，输入 ever search 会弹出输入框，根据输入的搜索条件返回笔记。返回的形式是 notebook>>note, 搜索使用的是印象笔记官方的搜索语言，比如 tag:java 等。更多使用方法可以查看官方文档 Evernote Search Grammar

发布笔记 -- ever publish当编辑或者更新笔记后，可以使用 ever publish 命令将笔记发布到印象笔记服务器上，实现笔记的同步。小猿会根据缓存信息判断是需要新建还是更新笔记，因此这部分在使用上你不必多考虑是该更新还是新建笔记，只要记住当你想同步当前笔记内容到印象笔记服务器上时，就可以使用 ever publish 了。

## 总结

一般情况下我的流程是利用 VsCode + markdown 写内容，然后利用 evermonkey 插件将内容同步到 evernote 上。

这里有一个问题，就是从 VsCode 同步过去的文章是只读的，在 evernote 那端不能改写 不过这样也有个好处，就是我们一定会保存本地 markdown 原文件，不依赖于 evernote 的网络存储，evernote 只做查阅，这样对数据安全是最大的保证。

## 参考

-   https://www.ucloud.cn/yun/82329.html
