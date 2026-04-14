---
title: "如何快速编写 HTML CSS 代码"
slug: 2023-12-03-ru-he-kuai-su-bian-xie-html-css-dai-ma
description: "HTML 和 CSS 代码冗长而繁复，稍不留神就容易写错，而且大部分都是类似的内容，很多重复劳动，一行一行写"
date: 2023-12-03T06:14:06.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-03-ru-he-kuai-su-bian-xie-html-css-dai-ma/cover.jpg
original_url: https://mp.weixin.qq.com/s/mTLFVyMOYnk-3_Xa6QT59A
categories:
  - 杂谈
tags:
  - VSCode
---
HTML 和 CSS 代码冗长而繁复，稍不留神就容易写错，而且大部分都是类似的内容，很多重复劳动，一行一行写的话，很费时。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-03-ru-he-kuai-su-bian-xie-html-css-dai-ma/001-3368eb70.png)

我记得多年前前端刚流行的时候，有一款插件让我眼前一亮，它可以通过写 一些 `字母+回车` 就能生成对应的 HTML 代码，当时它叫 `Zen Coding` ，现在它的名字是 `Emmet`

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-03-ru-he-kuai-su-bian-xie-html-css-dai-ma/002-a379aebd.gif)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-03-ru-he-kuai-su-bian-xie-html-css-dai-ma/003-c2ac8095.gif)

> “
> 
> Emmet（是一套面向文本编辑器的插件，它允许通过内容辅助高速度的编写和编辑 HTML、XML、XSL和其他结构化的代码格式
> 
> ”

好像新版的 Visual Studio Code 已经内置了 `Emmet`

本文我们就聊聊 Emmet 最常用的语法和示例。

## 语法

### Child: >

作用：生成内部嵌套元素

例如： `nav>ul>li`

```html
<nav>
    <ul>
        <li></li>
    </ul>
</nav>

```

### Multiplication: \*

作用：生成重复元素 例如： `ul>li*5`

```html
<ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>

```

### ID and CLASS attributes

作用：ID 和 class 控制 ，`#` 对应 ID, `.` 对应 class 属性

例如：

```html
#header
<div id="header"></div>
.title
<div class="title"></div>
form#search.wide
<form id="search" class="wide"></form>
p.class1.class2.class3
<p class="class1 class2 class3"></p>

```

### Sibling: +

作用：生成兄弟元素

例如： `div+p+bq`

```html
<div></div>
<p></p>
<blockquote></blockquote>

```

### Climb-up: ^

作用：虽然叫 climb-up ，但作用是跳出当前元素到元素的下面，多个 `^` 就是跳出多个父级元素。 例如：

`div+div>p>span+em^bq`

```html
<div></div>
<div>
    <p><span></span><em></em></p>
    <blockquote></blockquote>
</div>

```

`div+div>p>span+em^^bq`

```html
<div></div>
<div>
    <p><span></span><em></em></p>
</div>
<blockquote></blockquote>

```

### Item numbering: $

作用：生成元素序号 例如：

`ul>li.item$*5`

```html
<ul>
    <li class="item1"></li>
    <li class="item2"></li>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
</ul>

```

`h$[title=item$]{Header $}*3`

```html
<h1 title="item1">Header 1</h1>
<h2 title="item2">Header 2</h2>
<h3 title="item3">Header 3</h3>

```

`ul>li.item$$$*5`

```html
<ul>
    <li class="item001"></li>
    <li class="item002"></li>
    <li class="item003"></li>
    <li class="item004"></li>
    <li class="item005"></li>
</ul>

```

`ul>li.item$@-*5`

```html
<ul>
    <li class="item5"></li>
    <li class="item4"></li>
    <li class="item3"></li>
    <li class="item2"></li>
    <li class="item1"></li>
</ul>

```

`ul>li.item$@3*5`

```html
<ul>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
    <li class="item6"></li>
    <li class="item7"></li>
</ul>

```

### Custom attributes

作用：自定义元素

例如：

`p[title="Hello world"]`

```html
<p title="Hello world"></p>

```

`td[rowspan=2 colspan=3 title]`

```html
<td rowspan="2" colspan="3" title=""></td>

```

`[a='value1' b="value2"]`

```html
<div a="value1" b="value2"></div>

```

### Grouping: ()

作用： 分组

例如：

`div>(header>ul>li*2>a)+footer>p`

```html
<div>
    <header>
        <ul>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
        </ul>
    </header>
    <footer>
        <p></p>
    </footer>
</div>

```

`(div>dl>(dt+dd)*3)+footer>p`

```html
<div>
    <dl>
        <dt></dt>
        <dd></dd>
        <dt></dt>
        <dd></dd>
        <dt></dt>
        <dd></dd>
    </dl>
</div>
<footer>
    <p></p>
</footer>

```

### Text: {}

作用 ：为标签内添加文本内容

例如：

`a{Click me}`

```html
<a href="">Click me</a>

```

`p>{Click }+a{here}+{ to continue}`

```html
<p>Click <a href="">here</a> to continue</p>

```

## 有趣的知识

上面 gif 图中有个例子

`ul>li*4>lorem4`

效果是生成了如下代码

```html
 <ul>
    <li>Lorem ipsum dolor sit.</li>
    <li>Labore eum dignissimos exercitationem.</li>
    <li>Et sed quod distinctio?</li>
    <li>Voluptate dolor omnis maiores.</li>
 </ul>

```

你知道 lorem 是什么东西吗？

其实它是用来表示随机文本的，用来进行占位的。它的全文是：

> “
> 
> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
> 
> ”

这只是一段用来测试排版效果的占位文字，没有实际的含义。据说，16世纪的时候就有人开始用了。当时的某个印刷工人，从古罗马政治家西塞罗的文章中，选了一段拉丁文，"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit "，进行了混排，就把它创造出来了。这句拉丁文的英译是"Neither is there anyone who loves grief itself since it is grief and thus wants to obtain it"，译成中文就是"无人爱苦，亦无人寻之欲之，乃因其苦......"（不知是谁的手笔，译得真漂亮啊。）

所以  `lorem4` 就是生成4个单词的随机文本

## 参考

你可以通过下面的地址看到 `Emmet` 完整的语法介绍

-   https://docs.emmet.io/cheat-sheet/
