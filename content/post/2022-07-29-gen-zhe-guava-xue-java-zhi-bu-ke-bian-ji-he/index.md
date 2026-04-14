---
title: "跟着 Guava 学 Java 之 不可变集合"
slug: 2022-07-29-gen-zhe-guava-xue-java-zhi-bu-ke-bian-ji-he
description: "什么是不可变集合不可变集合，英文叫 immutable，顾名思义就是说集合是不可被修改的。集合的数据项是在创"
date: 2022-07-29T14:21:28.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-29-gen-zhe-guava-xue-java-zhi-bu-ke-bian-ji-he/cover.jpg
original_url: https://mp.weixin.qq.com/s/7Q7jCo1NhU0lrivyjmfCLg
categories:
  - 后端
tags:
  - Java
  - 数据结构
  - 多线程
---
## 什么是不可变集合

不可变集合，英文叫 immutable，顾名思义就是说集合是不可被修改的。集合的数据项是在创建的时候提供，并且在整个生命周期中都不可改变。

## 为什么要用不可变集合？

**第一：防御性编程需要**

我有一个集合，你拿来使用，鬼知道你会不会乱搞，往集合里添加不合适的元素，或者随便删除元素，我不放心，对，就是不信你，我的集合我做主，给你个不可变的吧，这样你就不可能乱搞我的集合了，我就放心了，不担心你的操作给我带来风险 。官方解释：防御，defensive programming，听起来高级不？

**第二：线程安全**

没有买卖就没有杀害！

集合是不可变的，不让你有变化，不可能有变化。没有变化，就没有竞态条件，多少个线程来都是一个样，安全，就是\*\*\*安全。

**第三：节省开销**

不需要支持可变性，可以尽量节省空间和时间的开销， 所有的不可变集合实现都比可变集合更加有效的利用内存。

## JDK9 之前的实现

`Collections`提供了一组方法把可变集合封装成不可变集合：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-29-gen-zhe-guava-xue-java-zhi-bu-ke-bian-ji-he/001-0aea7cac.jpg)

但这玩意儿有问题，举个例子：

```java
  List<String> list = new ArrayList<String>();
  list.add("a");
  list.add("b");
  list.add("c");
  
  List<String> unmodifiableList = Collections.unmodifiableList(list);
  list.add("d");
  System.out.println(unmodifiableList);

```

这个输出的结果居然是 [a,b,c,d]

what ? 这不就变了吗，我要的是不可变集合啊，这坑爹的玩意儿。有兄弟说了，那我切断 list 的引用是不就行了？

```java
  List<String> list = new ArrayList<String>();
  list.add("a");
  list.add("b");
  list.add("c");
  
  List<String> unmodifiableList = Collections.unmodifiableList(list);
  list.add("d");
  list = null;
  System.out.println(unmodifiableList);

```

呵呵，不行，输出仍然是  [a,b,c,d]  果然坑爹，而且你发现没有，编码也比较麻烦，还得用 Collections 间接转一下。

**Collections.unmodifiableList 实现的不是真正的不可变集合，当原始集合修改后，不可变集合也发生变化**。此外，它返回的数据结构本质仍旧是原来的集合类，所以它的操作开销，包括并发下修改检查，hash table 里的额外数据空间都和原来的集合是一样的。

由于这些问题，JDK9 出了些新的生成不可变集合的方法，比如

-   List.of
-   Set.of
-   Map.of
-   ......

确实可以直接生成不可变集合，编码也比较方便了：

```
 List<String> immutableList= List.of("a", "b", "c");

```

如果你要修改集合会抛出异常 `java.lang.UnsupportedOperationException`：

```
  immutableList.add("d");

```

but

```java
  List<String> list = new ArrayList<String>();
  list.add("a");
  list.add("b");
  list.add("c");

  List<List<String>> list1 = List.of(list);
  list.add("d");
  System.out.println(list1);

```

上面代码的输出仍然是 : [a,b,c,d]

当然我们不是说人家 api 是错的，人家就是这么设计的（爱信不信），可我感觉不爽，如果不小心可能会犯错，本来是防御性编程，搞不好干成跑路性编程了。

再次强调，不是说人家 JDK 设计错了，人家就是这么设计的，你的明白？当然不爽的还有 google 的工程师们，所以我们下面介绍下拿起键盘自己解决问题的 google 工程师们写的 guava 是怎么解决问题的。

## Guava

来，我们接着上面的那个例子，直接写个 Guava 版本的你自己体会下：

```java
  List<String> list = new ArrayList<String>();
  list.add("a");
  list.add("b");
  list.add("c");

  ImmutableList<String> strings = ImmutableList.copyOf(list);
  list.add("d");

  System.out.println(strings);

```

输出终于如我所愿的是 : [a,b,c] 了。

无论是从命名、语义、结果、代码可读性是不是都比 JDK 版本的好很多？这样的代码让我感觉世界又美好了一些。

美好的东西都想拥有，但问题来了， Guava 针对哪些集合提供了哪些对应的不可变集合类呢，这里我们给大家整理了一下：

| **可变集合接口** | **属于 JDK 还是 Guava** | **不可变版本** |
| --- | --- | --- |
| Collection | JDK | ImmutableCollection |
| List | JDK | ImmutableList |
| Set | JDK | ImmutableSet |
| SortedSet/NavigableSet | JDK | ImmutableSortedSet |
| Map | JDK | ImmutableMap |
| SortedMap | JDK | ImmutableSortedMap |
| Multiset | Guava | ImmutableMultiset |
| SortedMultiset | Guava | ImmutableSortedMultiset |
| Multimap | Guava | ImmutableMultimap |
| ListMultimap | Guava | ImmutableListMultimap |
| SetMultimap | Guava | ImmutableSetMultimap |
| BiMap | Guava | ImmutableBiMap |
| ClassToInstanceMap | Guava | ImmutableClassToInstanceMap |
| Table | Guava | ImmutableTable |

介绍几个方法：

-   of 方法，用法是一脉相承的，就是构建集合用的
-   copyOf ，上面例子中出现过，官方文档上说它是智能的，比如它可以判断参数是不是一个 immutable 对象，这样可以避免做拷贝

## JDK10

```java
  List<String> list = new ArrayList<String>();
  list.add("a");
  list.add("b");
  list.add("c");

  List<String> strings = List.copyOf(list);

  list.add("d");
  System.out.println(strings);

```

以上代码在 JDK10 以上版本输出  ：[a,b,c]，主要是因为 copyOf 方法是 10 以上版本才有的。

你看，JDK 也一直在进步，所以如果你用的是 JDK10 以及上版本，是不是要用 Guava 在这个具体功能点上就是可选的了。

## 最后

整体对比起来，我的个人感觉是在不可变集合的操作上 Guava 的 API 更好用一些，当然库的使用因人而异，用 JDK 原生的也没毛病，毕竟依赖更少，学习成本也小。

我们总说要改革、要进步，而真正的改革往往都不是自上而下的，很多都是自下而上的被推动着前进 ，如果没有 Guava，没有开源社区的很多优秀的库和组件，JDK 会不会把这些优秀的建议吸取进来？我不知道，但至少 JAVA 也一直在进步，也希望它越来越好。
