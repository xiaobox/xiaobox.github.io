---
title: "不建议在 Java 程序中使用 char 数据类型"
slug: 2020-01-09-bu-jian-yi-zai-java-cheng-xu-zhong-shi-yong-char-shu-ju-lei-
description: "UTF-8 UTF 字符集与编码 Unicode java char"
date: 2020-01-09T05:30:50.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-bu-jian-yi-zai-java-cheng-xu-zhong-shi-yong-char-shu-ju-lei-/cover.jpg
original_url: https://mp.weixin.qq.com/s/Ols1WF9NINV1OppGFjRDtw
categories:
  - 后端
tags:
  - Java
---
好了，看了标题我知道你有疑问，这里我得承认算并半个标题党吧。

事情是这样的：

这里有段程序，你跑一下，结果可能跟你想的不一样

```cs
 public static void main(String[] args) {
    String str = "䕫";
    System.out.println(str.length());
  }

```java

你可能认为字符串长度应该是1吧，为什么会是2呢？这里其实就是所谓的『坑』，说到这个坑，话就有些长了，我们先看一些关于字符的概念。

以下的基础知识我相信大多数开发的同学都知道，如果你明白直接跳过就好。

* * *

Unicode 字符集的出现就是为了统一编码。所谓字符集就是一个由众多不同的字符组成的集合。

Unicode 字符集对每一个字符都分配了一个唯一的 代码点(code point) 用来标识字符本身。

所谓代码点就是一个添加了 U+ 前缀的十六进制整数，如字母 A 的代码点就是 U+0041。

有了Unicode 字符集后，我们要考虑的就是以什么样的方式对这些字符进行传输和存储，这就是 Unicode 编码的实现方式，我们称为 Unicode 转换格式(Unicode Transformation Format，简称 UTF)。我们熟悉的 UTF-8、 UTF-16 等就是不同的 Unicode编码实现方式。

**码点如何转换成UTF的几种形式呢？**

**![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-bu-jian-yi-zai-java-cheng-xu-zhong-shi-yong-char-shu-ju-lei-/001-599b53a8.jpg)**

**如上图所示**

-   **UTF-32采用的定长四字节则是32位**

-   **UTF-8是变长的编码方案，可以有1，2，3，4四种字节组合**

-   **UTF-16是一种变长的2或4字节编码模式**

在 Unicode 字符集诞生之初，采用 UCS-2(2-byte Universal Character Set) 这种定长的编码方式对 Unicode 字符集进行编码，这种方式采用 16 bit 的长度来进行字符编码，所以最多可以对 2^16 = 65536 个字符进行编码(编码范围从 U+0000 ~ U+FFFF)。在当时的情况下，设计者们用了不到一半的数量就对所有字符进行了编码，并且认为剩余的空间足够用于未来新增字符的编码。

不幸的是，随着中文、日文、韩文等表意文字不断的加入，Unicode 字符集中的字符数量很快超过了 16 位所能编码的最大字符数量![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-bu-jian-yi-zai-java-cheng-xu-zhong-shi-yong-char-shu-ju-lei-/002-e836ff35.png)，于是设计者们对 Unicode 字符集进行了新的设计。

新的设计将字符集中的所有字符分为 17 个 代码平面(code plane)。其中 U+0000 ~ U+FFFF 这个代码点范围被划定为 基本多语言平面(Basic MultilingualPlane，简记为 BMP，如下图第一个花花绿绿的那个)，其余的字符分别划入 16 个 辅助平面(Supplementary Plane)，代码点范围为 U+10000 ~ U+10FFFF，这些处于辅助平面的字符我们称作 **增补字符**(supplementary characters)。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-bu-jian-yi-zai-java-cheng-xu-zhong-shi-yong-char-shu-ju-lei-/003-70acd495.jpg)

在 Unicode 字符集中的字符被重新划分到不同平面后，需要注意：

BMP 范围内的字符和 UCS-2 下的字符编码基本保持一致，但是 BMP 中的 U+D800 ~ U+DFFF 部分被留空，不分配给任何字符，作用是用于给辅助平面内的字符进行编码。

不是每个平面内的每个位置都被分配给了指定的字符，原因是：

特殊用途，如 BMP 中的 U+D800 ~ U+DFFF 部分；

-   作为保留空间

-   没有足够的字符

* * *

**回答程序输出长度为2而不是1的问题**

我们使用的字符其实不是普通字符，而是增补字符，我们知道 Java 中 char 的长度永远是 16 位，如果我们在字符串中使用了增补字符，那就意味着需要 2 个 char 类型的长度才能存储，对于 String 底层存储字符的数组 value 来说，就需要 2 个数组元素的位置。我们再看一下String 类length方法的源码：

```cs
/**
     * Returns the length of this string.
     * The length is equal to the number of <a href="Character.html#unicode">Unicode
     * code units</a> in the string.
     *
     * @return  the length of the sequence of characters represented by this
     *          object.
     */
public int length() {
return value.length;
    }

```

一切就明白了。java 的 String 内部用的 UTF-16 编码，String.length() 直接返回 code unit 的个数，也就是 Java 的 2 字节 char 的个数。

**当然这里不是说绝对不要用char,只是坑多（上面只是其中一个，JDK9还有别的** **![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-bu-jian-yi-zai-java-cheng-xu-zhong-shi-yong-char-shu-ju-lei-/004-d1210623.png)），建议少用而已。**
