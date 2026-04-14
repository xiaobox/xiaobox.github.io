---
title: "Java 集合 API 的改进"
slug: 2024-11-12-java-ji-he-api-de-gai-jin
date: 2024-11-12T04:13:20.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-12-java-ji-he-api-de-gai-jin/cover.jpg
original_url: https://mp.weixin.qq.com/s/z3Bi_3uyf3lKzVlZ6swAeA
categories:
  - 后端
tags:
  - Java
  - 数据结构
---
## 简介

本文我们将探讨不同 jdk 版本中各类的起源，以及新引入的类和接口背后的目的。我们将分析之前版本存在的问题，以及为何需要引入新的类或接口。此外，我们还将介绍集合类和接口中的新特性。文章将逐一解答这些问题。

我们将逐步学习 Java 集合类的优化过程，并按版本逐一对比分析。主要讨论的焦点将包括 JDK 1.0、1.2、1.4、1.5、1.6、1.8、9、10、11 和 21 版本的 Java 集合功能

## Java 集合 API 的改进

Java 集合 API 在多年中经历了显著改进，引入了新功能、增强和优化，以提高开发者的生产力、改善性能，并适应修订的编程模式和需求。它将帮助开发者利用 Java 集合的力量构建更健壮、高效和可维护的应用程序。

## JDK 1.0 中的集合类

在 JDK 1.0 中，有四个类 `Vector`、`Stack`、`Hashtable` 和 `Properties`。此外，还有一个名为“`Enumeration`”的接口，用于以简单的方式遍历值。进一步分类，Stack 是 Vector 的子类，Properties 是 Hashtable 的子类。

### Vector 类的问题

-   Vector 是线程安全的，即 Vector 中的所有方法都是同步的。因此，它不适合单线程环境。
-   由于它在内部基于数组工作，插入和删除操作非常慢。
-   它允许在其中添加重复元素
-   无法按顺序存储元素

### Hashtable 类的问题

-   Hashtable 是线程安全的，即 Hashtable 中的所有方法都是同步的。因此，它不适合单线程环境。
-   Hashtable 无法按顺序存储条目

### Enumeration 的问题

-   无法删除元素且方法名称过长

## JDK 1.2 中的集合类

在 JDK 1.2 中，Sun Micro-system 引入了 `ArrayList`、`LinkedList`、`HashSet`、`TreeSet`、`HashMap`、`TreeMap`、`Iterator` 和 `ListIterator`。

-   ArrayList：用于提供单线程环境下的解决方案，因为 ArrayList 中的方法不是同步的。
-   LinkedList 用于提供更快的元素插入和删除。
-   HashSet：不允许有重复元素。
-   TreeSet：用于按排序顺序存储元素。
-   HashMap：提供单线程环境下的解决方案，因为 HashMap 中的方法不是同步的。
-   TreeMap：用于按顺序存储键值对。
-   Iterator：用于解决枚举问题。同时还有一个专门处理列表的类 ListIterator。

**HashSet 的问题**：它不能保持插入顺序，即它不会按照元素添加到集合中的顺序存储元素。

**HashMap 的问题**：像 HashSet 一样，它不能保持插入顺序。

## JDK 1.4 中的集合类

在 JDK 1.2 中，Sun Microsystems 引入了 `LinkedHashSet` 和 `LinkedHashMap`。

-   LinkedHashSet：用于解决 HashSet 中插入顺序的问题。它按照元素添加到集合中的顺序存储元素。
-   LinkedHashMap：用于解决 HashMap 中插入顺序的问题。它还按照元素添加到集合中的顺序存储元素。

## JDK 1.5 中的集合类

-   for-Each 循环：作为替代迭代器进行迭代的另一种方法
-   CopyOnWriteArrayList：引入以允许在修改底层列表的情况下安全地迭代元素。
-   CopyOnWriteArraySet：它使用内部 CopyOnWriteArrayList 进行所有操作。因此，它具有与该列表相同的基本属性。

## JDK 1.6 中的集合类

-   NavigableSet：作为扩展了导航方法的有序集合，用于报告给定搜索目标的最近匹配。
-   NavigableMap：作为扩展了导航方法的 SortedMap，返回给定搜索目标的最近匹配项。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-12-java-ji-he-api-de-gai-jin/001-b283acb5.jpg)

## JDK 1.8 中的集合类

Java 集合框架也有新更新，以支持 lambda 表达式、流和聚合操作。

-   stream() 作为父接口 Collection 的默认方法：返回一个以该集合为源的顺序 Stream。
-   parallelStream() 作为父接口 Collection 的默认方法：返回一个可能并行的 Stream，以这个集合作为其源。
-   spliterator() 作为父接口 Collection 的一个默认方法：创建一个遍历此集合中元素的 Spliterator
-   removeIf(Predicate filter) 作为父接口 Collection 的默认方法：移除满足给定谓词的所有元素。

同样重要的是，这里的一个显著点是所有新添加的方法都是接口 Collection 内部的默认方法。这是使用默认方法的最佳示例。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-12-java-ji-he-api-de-gai-jin/002-bf3a4631.png)

## Java 9 中的集合增强

-   新增用于创建不可变列表、集合和映射的 of() 静态工厂方法介绍。这些方法包括：`List.of()`, `Set.of()`, `Map.of()`, `Map.ofEntries()`
-   Arrays.mismatch()：新增方法以查找两个数组中第一个不匹配的索引。
-   Arrays.compare()：添加了新方法来比较提供的两个数组中的元素。
-   为 Arrays.equals() 添加了更多重载方法。
-   Enumeration.asIterator()：添加了返回 java.util.Iterator 实例的新方法。

此外，在 `Stream` API 中添加了一些方法，如 dropWhile、takeWhile 和 ofNullable。

## Java 10 中的集合增强

引入了 List.copyOf()、Set.copyOf() 和 Map.copyOf()，用于创建现有集合的不变副本。

## Java 11 中的集合增强

Collection.toArray(IntFunction)：添加了新的默认方法，允许将集合的元素转移到新创建的具有所需运行时类型的数组中。新方法是现有 toArray(…) 方法的重载变体。

## Java 21 中的集合增强

Java 21 在集合框架中引入了三个新接口：`SequencedCollection`、`SequencedSet` 和 `SequencedMap`。这些新的集合接口通过新库提供的默认方法，使我们能够访问其第一个和最后一个元素。该功能还允许我们通过简单的调用方法来获取集合的反转视图。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-12-java-ji-he-api-de-gai-jin/003-e53f56fa.png)

### SequencedCollection  序列集合

```
default void addFirst(E e)
default void addLast(E e)

default E getFirst()
default E getLast()

default E removeFirst()
default E removeLast()

SequencedCollection<E> reversed()

```

### SequencedSet 序列集合

```
SequencedSet<E> reversed()

```

### SequencedMap 序列映射

```
default Map.Entry<K,V> firstEntry()
default Map.Entry<K,V> lastEntry()

default Map.Entry<K,V> pollFirstEntry()
default Map.Entry<K,V> pollLastEntry()

default V putFirst(K k, V v)
default V putLast(K k, V v)

SequencedMap<K,V> reversed()

default SequencedSet<Map.Entry<K,V>> sequencedEntrySet()
default SequencedSet<K> sequencedKeySet()
default SequencedCollection<V> sequencedValues()

```
