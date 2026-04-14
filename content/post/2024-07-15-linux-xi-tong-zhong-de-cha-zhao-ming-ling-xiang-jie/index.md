---
title: "Linux 系统中的查找命令详解"
slug: 2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie
description: "在 Linux 系统中，查找文件和目录是日常操作中的一项重要任务。"
date: 2024-07-15T09:21:31.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/cover.jpg
original_url: https://mp.weixin.qq.com/s/nl-XAX-HpIc2-V7rlP0Sig
categories:
  - 系统底层
tags:
  - Linux
---
在 Linux 系统中，查找文件和目录是日常操作中的一项重要任务。本文将详细介绍几种常用的查找命令，包括`locate`、`whereis`、`which`和`find`，帮助你在 Linux 系统中快速找到所需内容。

## `locate`命令

`locate`命令通过搜索整个文件系统来查找包含特定关键词的所有文件。其基本用法如下：

`locate 关键词   `

需要注意的是，`locate`命令依赖于一个每日更新的数据库，因此对于新创建的文件可能不会立即出现在搜索结果中。可以使用以下命令手动更新数据库：

`updatedb   `

例如，查找`aircrack-ng`相关文件：

`locate aircrack-ng   `

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/001-a67bd904.png)

## `whereis`命令

在 Linux 系统中，二进制文件通常被称为可执行文件，如果你想要查找某个二进制文件，`whereis`命令比`locate`更高效。其用法如下：

`whereis 二进制文件名   `

该命令会返回二进制文件的位置、其源代码以及相应的手册页（如果存在）。例如：

`whereis aircrack-ng   `

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/002-792126d3.png)

## `which`命令

Linux 系统中的`PATH`变量包含了系统查找命令的目录列表。`which`命令用于在`PATH`变量中定位某个二进制文件。其基本用法如下：

`which 二进制文件名   `

如果在当前的`PATH`中找不到该二进制文件，则返回空。例如：

`which aircrack-ng   `

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/003-25dcae89.png)

通常这些目录包括`/usr/bin`，但也可能包括`/usr/sbin`等其他目录。

## `find`命令

`find`命令是最强大的查找命令，可以在指定目录中根据多种参数进行搜索。其基本语法如下：

`find 目录 选项 表达式   `

假设我们有一个名为`test.txt`的文件，但不确定其所在目录，可以使用以下命令从文件系统的顶层开始搜索：

`find / -type f -name test.txt   `

其中：

-   `/` 表示从文件系统的顶层开始搜索。
-   `-type` 表示要查找的文件类型，`f`代表普通文件，`d`代表目录，`l`代表符号链接等。
-   `-name` 表示要查找的文件名，结果将精确匹配。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/004-f850bebc.png)

搜索所有目录可能需要一些时间，我们可以通过指定目录来加快速度。例如，知道文件在`home`目录下：

`time find /home -type f -name test.txt   `

我在这里使用了时间命令，所以我们可以看到每个命令花了多长时间。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/005-a75715ee.png)

`find`命令只显示精确匹配的文件名，如果文件名有不同的扩展名，则不会返回结果。例如，查找`test.conf`文件：

`find /home -type f -name test.conf   `

可以通过使用通配符解决这个限制，通配符有几种形式：

-   `*` 匹配多个字符，例如`*at`将匹配：cat, hat, what 和 bat。
-   `?` 匹配单个字符，例如`?at`将匹配 cat, hat 和 bat，但不匹配 what。
-   `[]` 匹配方括号内的字符，例如`[c,b]at`将匹配 cat 和 bat。

例如：

`find /home -type f -name test.*   `

`find`命令还支持多种测试和操作符，例如查找权限不是 0600 的文件和权限不是 0700 的目录：

`find ~ ( -type f -not -perm 0600 ) -or ( -type d -not -perm 0700 )   `

该命令的含义是：查找所有权限不是 0600 的文件或权限不是 0700 的目录。

-   `find ~` 查找`~`目录（home 目录）。
-   `( -type f -not -perm 0600 )` 使用括号将测试和操作符分组，`-not`表示结果为假时匹配，`-not`可以简写为`!`，所以这部分也可以写成`( -type f ! -perm 0600 )`。
-   `-or` 表示如果任一测试为真，则匹配，可以简写为`-o`。
-   `( -type d -not -perm 0700 )` 另一个测试，类似于第一个，只是类型为目录。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-15-linux-xi-tong-zhong-de-cha-zhao-ming-ling-xiang-jie/006-b08d5dd5.png)

`find`命令功能强大，支持多种测试，建议深入了解。

以上就是 Linux 系统中查找命令的介绍，希望能对你有所帮助。
