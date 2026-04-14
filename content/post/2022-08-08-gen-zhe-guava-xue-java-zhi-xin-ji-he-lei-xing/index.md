---
title: "跟着 Guava 学 Java 之 新集合类型"
slug: 2022-08-08-gen-zhe-guava-xue-java-zhi-xin-ji-he-lei-xing
description: "Guava 引入了很多 JDK 没有的、但明显有用的新集合类型。这些新类型是为了和 JDK 集合框架共存"
date: 2022-08-08T17:26:09.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-08-gen-zhe-guava-xue-java-zhi-xin-ji-he-lei-xing/cover.jpg
original_url: https://mp.weixin.qq.com/s/BI-r8hXqdBlN_PwfYUVixA
categories:
  - 后端
tags:
  - Java
  - Python
  - JavaScript
  - 数据结构
---
Guava 引入了很多 JDK 没有的、但明显有用的新集合类型。

这些新类型是为了和 JDK 集合框架共存，而没有往 JDK 集合抽象中硬塞其他概念。

作为一般规则，Guava 集合非常精准地遵循了 JDK 接口契约。

## Multiset

我们都知道 Set 是无序不重复的，与之相反的是 List 是有序可重复的。Multiset 是几个意思？

没错 ，**Multiset 占据了 List 和 Set 之间的一个灰色地带：允许重复，但是不保证顺序**。

举个例子，使用 JDK 如果我们想：“统计每个单词出现的次数” 一般这样写：

```java
Map<String, Integer> counts = new HashMap<String, Integer>();
for (String word : words) {
    Integer count = counts.get(word);
    if (count == null) {
        counts.put(word, 1);
    } else {
        counts.put(word, count + 1);
    }
}

```

我用 multiset 就轻松多了，比如

```java
  List<String> languages = List.of("java", "python", "javascript", "java");

  HashMultiset<String> multiset = HashMultiset.create(languages);

  System.out.println(multiset.count("java"));   //结果是：2
  System.out.println(multiset.count("python")); //结果是：1
  
  // 如果你想要不重复元素集合，还可以直接转成 Set 
  // Set<String> words = multiset.elementSet();

```

如果你用传统的 HashMap 做统计，那么后续如果再增加元素，你想变更统计结果是不还得再写个 for 循环往 Map 添加元素计数？用 Multiset 轻松多了，直接 add 就行：

```java
  List<String> languages = List.of("java", "python", "javascript", "java");

  HashMultiset<String> multiset = HashMultiset.create(languages);

  multiset.add("python");
  multiset.addAll(Lists.newArrayList("go", "java", "c"));

  multiset.elementSet().forEach(x -> {
      System.out.println(x + " 的出现次数： " + multiset.count(x));
  });

```

结果：

```
python 的出现次数： 2
java 的出现次数： 3
c 的出现次数： 1
go 的出现次数： 1
javascript 的出现次数： 1

```

当然如果你的需求比较简单，比如只是简单统计去重后的个数什么的，用 JDK8 以上的流式编程一行代码就能搞定，不用搞这么复杂

```
words.stream().distinct().count();

```

下面是 multiset 的一些常用方法：

| **方法** | **描述** |
| --- | --- |
| count(E) | 给定元素在 Multiset 中的计数 |
| elementSet() | Multiset 中不重复元素的集合，类型为 Set |
| entrySet() | 和 Map 的 entrySet 类似，返回 Set<Multiset.Entry>，其中包含的 Entry 支持 getElement() 和 getCount() 方法 |
| add(E, int) | 增加给定元素在 Multiset 中的计数 |
| remove(E, int) | 减少给定元素在 Multiset 中的计数 |
| setCount(E, int) | 设置给定元素在 Multiset 中的计数，不可以为负数 |
| size() | 返回集合元素的总个数（包括重复的元素） |

Guava 提供了多种 Multiset 的实现，大致对应 JDK 中 Map 的各种实现：

| **Map** | 对应的 Multiset | 是否支持 null 元素 |
| --- | --- | --- |
| HashMap | HashMultiset | 是 |
| TreeMap | TreeMultiset | 是（如果 comparator 支持的话） |
| LinkedHashMap | LinkedHashMultiset | 是 |
| ConcurrentHashMap | ConcurrentHashMultiset | 否 |
| ImmutableMap | ImmutableMultiset | 否 |

### 总结

使用 Multiset 可以减少 Map 的复杂操作，从而减少代码量，代码量少了，bug 自然少。早点儿下班。

## Multimap

有的时候我们需要一个 key 对应多个 value 的这种结构，通常我们会构造类似这样的数据结构：

`Map<K, List<V>> 或 Map<K, Set<V>>` ，甚至可能更复杂，基于这个还有嵌套数据结构。

如果你需要找到 List 中的某个值是否存在，或者删除 List 中的一个元素 ，又或者要遍历整个数据结构，那么要写一坨代码，老费劲了。

我们来看用 Multimap 怎么做，比如：

```
    ArrayListMultimap<String, String> multimap = ArrayListMultimap.create();

    multimap.put("Fruits", "Bannana");
    multimap.put("Fruits", "Apple");
    multimap.put("Fruits", "Pear");
    multimap.put("Vegetables", "Carrot");

    multimap.put("language", "java");
    multimap.put("language", "python");
    multimap.put("language", "go");
    multimap.put("language", "python");

```

下面是输出的结果：

`{Vegetables=[Carrot], language=[java, python, go, python], Fruits=[Bannana, Apple, Pear, Pear]}`

如果想得到某一个 key 的 value 直接 get 就可以了

```
List<String> language = multimap.get("language");

```

如果你想转回原生的那种数据结构也是可以的，使用 asMap() ：

```
Map<String, Collection<String>> stringCollectionMap = multimap.asMap();

```

但要注意，stringCollectionMap 是一个**关联的视图**，在这个 Map 上的操作会作用于原始的`Multimap`

下面是一些可以很方便地修改 multimap 的方法：

| **方法签名** | **描述** | **等价于** |
| --- | --- | --- |
| put(K, V) | 添加键到单个值的映射 | multimap.get(key).add(value) |
| putAll(K, Iterable) | 依次添加键到多个值的映射 | Iterables.addAll(multimap.get(key), values) |
| remove(K, V) | 移除键到值的映射；如果有这样的键值并成功移除，返回 true。 | multimap.get(key).remove(value) |
| removeAll(K) | 清除键对应的所有值，返回的集合包含所有之前映射到 K 的值，但修改这个集合就不会影响 Multimap 了。 | multimap.get(key).clear() |
| replaceValues(K, Iterable) | 清除键对应的所有值，并重新把 key 关联到 Iterable 中的每个元素。返回的集合包含所有之前映射到 K 的值。 | multimap.get(key).clear(); Iterables.addAll(multimap.get(key), values) |

### 迭代 Multimap

Guava `MultiMap` 提供 `keySet(), entries(), values(), keys()` 方法类似于 Map 的相应视图集合。

```java
// 使用 `keySet()` 方法遍历 Guava 的 `MultiMap`
for (K key: multimap.keySet()) {
    System.out.println(key + ": " + multimap.get(key));
}

// 使用 `entries()` 方法遍历 Guava 的 `MultiMap`
for (Map.Entry<K, V> entry: multimap.entries()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

```

### 在 Multimap 中查找键/值

Guava 提供了三种方法，即 `containsKey()`, `containsValue()` 和 `containsEntry()` 检查 multimap 是否包含至少一个键值对，分别具有指定的键、指定的值和指定的键值对。

```java
  ListMultimap<String, String> multimap = ArrayListMultimap.create();
 
  multimap.put("John", "Tyler");
  multimap.put("John", "Kennedy");
  multimap.put("George", "Washington");
  multimap.put("George", "Bush");
  // 检查 multimap 是否包含至少一个键值对
  // 以“John”为键
  if (multimap.containsKey("John")) {
      System.out.println("Multimap contains the \"John\" key");
  }
  // 检查 multimap 是否包含至少一个键值对
  // 以“Kennedy”为值
  if (multimap.containsValue("Kennedy")) {
      System.out.println("Multimap contains the \"Kennedy\" value");
  }
  // 检查 multimap 是否包含至少一个键值对
  // 以“George”为键，以“Washington”为值
  if (multimap.containsEntry("George", "Washington")) {
      System.out.println("Multimap contains the specified mapping");
  }

```

### 不可变 Multimap

Guava’s `Multimap` 接口有三个不可变的实现—— `ImmutableMultimap`, `ImmutableListMultimap`， 和

`ImmutableSetMultimap`

```java
ListMultimap<String, String> immutableMultimap =
                ImmutableListMultimap.<String, String>builder()
                                    .put("Zachary", "Taylor")
                                    .put("John", "Adams")
                                    .put("John", "Tyler")
                                    .put("John", "Kennedy")
                                    .put("George", "Washington")
                                    .put("George", "Bush")
                                    .put("Grover", "Cleveland").build();
 
  System.out.println("John" + ": " + immutableMultimap.get("John"));
  
  try {
      // 这将失败，因为 map 是不可变的
      immutableMultimap.put("Obama", "Barack");
  }
  catch (UnsupportedOperationException ex) {
      System.out.print("java.lang.UnsupportedOperationException thrown");
  }

```

### Multimap 的各种实现

| **实现** | **键行为类似** | **值行为类似** |
| --- | --- | --- |
| ArrayListMultimap | HashMap | ArrayList |
| HashMultimap | HashMap | HashSet |
| LinkedListMultimap | LinkedHashMap | LinkedList |
| LinkedHashMultimap | LinkedHashMap | LinkedHashMap |
| TreeMultimap | TreeMap | TreeSet |
| ImmutableListMultimap | ImmutableMap | ImmutableList |
| ImmutableSetMultimap | ImmutableMap | ImmutableSet |

除了两个不可变形式的实现，其他所有实现都支持 null 键和 null 值

### 注意

我们可以使用 `size()` 方法来确定 multimap 中键值对的总数。请注意，此方法不会返回多重映射中不同键的总数。要获得不同键的总数，请考虑使用 `keySet().size()` 或者 `asMap().size()`.

### 总结

如果你有类似上文的复杂数据结构，请使用 `Multimap` 它的优点超过 `java.util.Map`。可能有些同学用过 apache 的`org.apache.commons.collections4.MultiValuedMap` ，我个人感觉 Guava 的更好用。

## BiMap

BiMap 提供了一种 key 和 value 的双向关联的数据结构。

我们知道对于 Map 可能通过 key 获得 value ，但反过来呢，通过 value 怎么取得 key 呢，比较费劲，类似下面代码：

```java
  Map<String, String> testMap = Map.of("language", "java", "fruit", "apple");
  //通过 key 获取 value
  System.out.println(testMap.get("language"));

  //通过 value 获取 key
  for (Map.Entry<String, String> entry : testMap.entrySet()) {

      if (entry.getValue().equals("java")){
          System.out.println(entry.getKey());
          return;
      }
  }

```

你可能会说，不用那么麻烦，我用 stream 一行能搞定，比如：

```
testMap.entrySet().stream().filter(entry -> entry.getValue().equals("java")).findFirst().get().getKey()

```

这个怎么说呢，行是行，代码可读性也挺好，对于熟悉 stream API 的没问题，不熟悉的理解起来有些成本。

我们来看看用 Guava 的 BiMap 怎么解决：

```java
 HashBiMap<String,String> bimap = HashBiMap.create();

  bimap.put("language","java");
  bimap.put("fruit","apple");

  // 通过 key 获取 value
  System.out.println(bimap.get("fruit"));
  // 通过 value 获取 key
  System.out.println(bimap.inverse().get("apple"));

```

是不是感觉很简洁。

这里要注意：**反转的 map 不是新的 map 对象，它实现了一种视图关联，这样你对于反转后的 map 的所有操作都会影响原先的 map 对象**

### **BiMap 数据的强制唯一性**

在使用 BiMap 时，会要求 Value 的唯一性。如果 value 重复了则会抛出错误：java.lang.IllegalArgumentException，例如

```
  HashBiMap<String,String> bimap = HashBiMap.create();

  bimap.put("language","java");
  bimap.put("fruit","apple");
  bimap.put("hello","java");

```

如果我们确实需要插入重复的 value 值，那可以选择 forcePut 方法。但是我们需要注意的是前面的 key 也会被覆盖了。

value 不能重复，本身 map 的 key 就不是重复的，所以 Bimap 等于即不允许 key 重复，也不允许 value 重复。

### BiMap 的各种实现

| Key-Value Map 实现 | Value-Key Map 实现 | 对应 BiMap 的实现 |
| --- | --- | --- |
| HashMap | HashMap | HashBiMap |
| ImmutableMap | ImmutableMap | ImmutableBiMap |
| EnumMap | EnumMap | EnumBiMap |
| EnumMap | HashMap | EnumHashBiMap |

## Table

当你想使用多个键做索引的时候，你可能会用类似 Map<FirstName, Map<LastName, Person>>的实现，这种方式很丑陋，使用上也不友好。Guava 为此提供了新集合类型`Table`，它有两个支持所有类型的键：“行”和“列” ，和 sql 中的联合主键有点像？

我们看个例子：

```
  // 大学课程座位表
  Table<String, String, Integer> universityCourseSeatTable
                = HashBasedTable.create();
  universityCourseSeatTable.put("Mumbai", "Chemical", 120);
  universityCourseSeatTable.put("Mumbai", "IT", 60);
  universityCourseSeatTable.put("Harvard", "Electrical", 60);
  universityCourseSeatTable.put("Harvard", "IT", 120);

  int seatCount
          = universityCourseSeatTable.get("Mumbai", "IT");
  Integer seatCountForNoEntry
          = universityCourseSeatTable.get("Oxford", "IT");

```

通过 “行”和“列” 定位到 value，不需要再像以前一样构造复杂的数据结构以及复杂的遍历代码。

Table 有如下几种实现：

-   HashBasedTable：本质上用 HashMap<R, HashMap<C, V>>实现；
-   TreeBasedTable：本质上用 TreeMap<R, TreeMap<C,V>>实现；
-   ImmutableTable：本质上用 ImmutableMap<R, ImmutableMap<C, V>>实现；注：ImmutableTable 对稀疏或密集的数据集都有优化。
-   ArrayTable：要求在构造时就指定行和列的大小，本质上由一个二维数组实现，以提升访问速度和密集 Table 的内存利用率

### 检查元素

```
  Table<String, String, Integer> universityCourseSeatTable = HashBasedTable.create();
  universityCourseSeatTable.put("Mumbai", "Chemical", 120);
  universityCourseSeatTable.put("Mumbai", "IT", 60);
  universityCourseSeatTable.put("Harvard", "Electrical", 60);
  universityCourseSeatTable.put("Harvard", "IT", 120);

  //行列的组合是否存在
  boolean entryIsPresent
          = universityCourseSeatTable.contains("Mumbai", "IT");
  //列是否存在
  boolean courseIsPresent
          = universityCourseSeatTable.containsColumn("IT");
  //行是否存在
  boolean universityIsPresent
          = universityCourseSeatTable.containsRow("Mumbai");
  //值是否存在
  boolean seatCountIsPresent
          = universityCourseSeatTable.containsValue(60);

```

### 删除元素

想要删除元素，也需要通过“行”和“列”的组合

```
universityCourseSeatTable.remove("Mumbai", "IT");

```

### 获取子 map

以“行”为 key ，获取 列和值 的 map

```
 Map<String, Integer> harvard = universityCourseSeatTable.row("Harvard");

```

以“列”为 key , 获取 行和值的 map

```
 Map<String, Integer> universitySeatMap = universityCourseSeatTable.column("IT");

```

### 转换到传统 map

如果你看着 Table 不顺眼了，还可以转换回传统的双层 map 嵌套的数据结构：

```java
    Map<String, Map<String, Integer>> courseKeyUniversitySeatMap
                = universityCourseSeatTable.rowMap();

    Map<String, Map<String, Integer>> universityKeyCourseSeatMap
            = universityCourseSeatTable.columnMap();

    System.out.println(courseKeyUniversitySeatMap);
    System.out.println(universityKeyCourseSeatMap);

```

输出：

```
{Mumbai={Chemical=120, IT=60}, Harvard={Electrical=60, IT=120}}
{Chemical={Mumbai=120}, IT={Mumbai=60, Harvard=120}, Electrical={Harvard=60}}

```

### 获得行、列或 value 的集合

```java
  System.out.println(universityCourseSeatTable.rowKeySet());
  System.out.println(universityCourseSeatTable.columnKeySet());
  System.out.println(universityCourseSeatTable.values());

  
  输出：
  [Mumbai, Harvard]
  [Chemical, IT, Electrical]
  [120, 60, 60, 120]

```

### 行列转换

```java
 Table<String, String, Integer> universityCourseSeatTable
                = HashBasedTable.create();
  universityCourseSeatTable.put("Mumbai", "Chemical", 120);
  universityCourseSeatTable.put("Mumbai", "IT", 60);
  universityCourseSeatTable.put("Harvard", "Electrical", 60);
  universityCourseSeatTable.put("Harvard", "IT", 120);

  for (Table.Cell<String, String, Integer> temp : universityCourseSeatTable.cellSet()) {
      System.out.println(temp.getRowKey() + " " + temp.getColumnKey()+ " " + temp.getValue());
  }

  Table<String,String,Integer> tables2= Tables.transpose(universityCourseSeatTable);

  System.out.println("=====行列转换后=====");
  for (Table.Cell<String, String, Integer> temp : tables2.cellSet()) {
      System.out.println(temp.getRowKey() + " " + temp.getColumnKey()+ " " + temp.getValue());
  }

```

利用`cellSet`方法可以得到所有的数据行，打印结果，可以看到`row`和`column`发生了互换，输出：

```
Mumbai Chemical 120
Mumbai IT 60
Harvard Electrical 60
Harvard IT 120
=====行列转换后=====
Chemical Mumbai 120
IT Mumbai 60
Electrical Harvard 60
IT Harvard 120

```

### 总结

虽然 Table 底层代码仍然使用的是嵌套 map 结构，但是经过封装使用起来简单多了，如有类似需求可以直接使用 Table，至于应用场景就看大家的需求了，感觉用好了就像用 SQL 操作内存数据库一样，比调用数据库快多了。

## RangeSet

介绍 RangeSet 之前，我们得先了解一下 Guava 的`Range` 类，其实顾名思义就是表达区间范围，我们看一下它的 type 就明白了：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-08-gen-zhe-guava-xue-java-zhi-xin-ji-he-lei-xing/001-0aca7405.jpg)

RangeSet 类是用来存储一些不为空的也不相交的范围的数据结构。假如需要向 RangeSet 的对象中加入一个新的范围，那么任何相交的部分都会被合并起来，所有的空范围都会被忽略。

```java
  RangeSet rangeSet = TreeRangeSet.create();
  rangeSet.add(Range.closed(1, 10));
  System.out.println(rangeSet);
  rangeSet.add(Range.closed(2,8));
  System.out.println(rangeSet);
  rangeSet.add(Range.closedOpen(11, 15));
  System.out.println(rangeSet);
  rangeSet.add(Range.open(15, 20));
  System.out.println(rangeSet);
  rangeSet.add(Range.openClosed(0, 0));
  System.out.println(rangeSet);
  rangeSet.remove(Range.open(5, 10));
  System.out.println(rangeSet);

```

输出：

```
{[1‥10]}
{[1‥10][11‥15)}
{[1‥10][11‥15)(15‥20)}
{[1‥5][10‥10][11‥15)(15‥20)}

```

### 得到 rangeSet 互补的范围

们可以用 RangeSet 提供的 complement() 方法，rangeSet.complement() 同样是一个 RangeSet，其中的元素也是互不相交、且不为空的 RangeSet，那么 rangeSet 的互补集可以像下面这样来写：

```java
RangeSet complement = rangeSet.complement();
System.out.println(complement);

输出：
{(-∞‥1)(5‥10)(10‥11)[15‥15][20‥+∞)}

```

### 包含查找

如果想知道某个元素是在 rangeSet 中哪个范围里面，可以这样写：

```java
Range integerRange = rangeSet.rangeContaining(17);
System.out.println(integerRange); 
//输出 (15‥20)，因为 17 被包含在 (15‥20) 中，所以输出这个范围。

```

如果想知道某个范围是否包含在 rangeSet 的范围中，可以这样写：

```java
boolean encloses = rangeSet.encloses(Range.closedOpen(18, 20));
System.out.println(encloses);//true. 因为范围 (18,20) 包含在范围 (15,20) 中
encloses = rangeSet.encloses(Range.closedOpen(5, 20));
System.out.println(encloses);//false. 因为范围 (5,20) 不被 rangeSet 中任何范围包含。

```

## RangeMap

看到这个名字，聪明的你一定猜到了，它又是跟 Range 相关的，对，没错。

RangeMap 是一种集合类型 ( collection type)，它将不相交、且不为空的 Range（key）映射给一个值（Value）。**和 RangeSet 不一样，RangeMap 不可以将相邻的区间合并，即使这个区间映射的值是一样的。**

举个例子：

```java
 RangeMap<Integer, String> rangeMap = TreeRangeMap.create();

  rangeMap.put(
          Range.closed(90, 100), "偏瘦");
  rangeMap.put(
          Range.closed(100, 130), "正常");
  rangeMap.put(
          Range.closed(101, 111), "正常 1");
  rangeMap.put(
          Range.closed(130, 150), "偏胖");
  rangeMap.put(
          Range.closed(150, 180), "肥胖");

  //正常 1
  System.out.println(rangeMap.get(103));

  //[[90..100)=偏瘦，[100..101)=正常，[101..111]=正常 1, (111..130)=正常，[130..150)=偏胖，[150..180]=肥胖]
  System.out.println(rangeMap); 

```

从输出中我们可以看到，rangeMap 中的每一段 range 都对应着一个 value

### TreeMap

通过上面的代码，我们能看到 TreeMap 的一些特性

-   TreeRangeMap 是 RangeMap 的一个实现，保证内部区间不重叠且有序（通过上面的代码能看出来）
-   如果 TreeRangeMap 要插入的区间与 TreeRangeMap 已保存的区间发生重叠，那么 TreeRangeMap 会对之前的区间切割，保留当前插入区间的完整性
-   TreeRangeMap 虽然以区间作为键，但 get 方法却以单个值 K 作为参数。此时，TreeRangeMap 会先查找这个 K 对应的区间，然后返回这个区间对应的值

### remove

remove 方法用来切割 TreeRangeMap 中的键区间

1）如果 TreeRangeMap 中的某个区间没有被完全删除，那么这个区间只是被切割小，但还是存在于 TreeRangeMap 中  2）如果 TreeRangeMap 中的某个区间被完全删除，那么这个区间和对应的值都被删除掉

### subRange

和 RangeSet 不一样，RangeMap 没有提供 complement()、contains()、rangeContaining() 以及 encloses() 方法。

但提供了 subRange ，可以获取一个子区间。

```java
  RangeMap<Integer, String> rangeMap = TreeRangeMap.create();

  rangeMap.put(
          Range.closed(90, 100), "偏瘦");
  rangeMap.put(
          Range.closed(100, 130), "正常");
  rangeMap.put(
          Range.closed(101, 111), "正常 1");
  rangeMap.put(
          Range.closed(130, 150), "偏胖");
  rangeMap.put(
          Range.closed(150, 180), "肥胖");

  RangeMap<Integer, String> subRangeMap1 = rangeMap.subRangeMap(Range.closed(1, 80));
  RangeMap<Integer, String> subRangeMap2 = rangeMap.subRangeMap(Range.closedOpen(93, 150));
  System.out.println(subRangeMap1);
  System.out.println(subRangeMap2);

```

输出结果：

```
{}
{[93..100)=偏瘦，[100..101)=正常，[101..111]=正常 1, (111..130)=正常，[130..150)=偏胖}

```

从输出结果可以看出，如果要划出的子 Range 和 RangeMap 没有交集，那么返回空，如果有，则返回所有的 Range。

根据 subRange 的特性我想到了一个实用的场景：

> “
> 
> 假设我们的业务是租赁业务（房子、车、录像带等等），比如租车，一辆车在一天的 24 小时内都可能被租走，如何根据用户预约的租赁时间快速判断一辆车在这个时间段是否被占用？
> 
> ”

**我们可以把已某辆车哪天的租赁时间段存入 RangeMap ，再调用 subRangeMap 传入预约时间段参数去看有没有交集，如果返回空表明这段时间没被占用，可以租，如果非空则证明有时间冲突不能租**。（当然你也可以自己写个贪心算法来解决）

### 整体跨度

```java
 Range<Integer> span = rangeMap.span();
 System.out.println(span.lowerEndpoint().intValue()); //90
 System.out.println(span.upperEndpoint().intValue()); //180

```

## 参考

-   https://www.baeldung.com/guava-rangemap
-   https://www.baeldung.com/java-map-key-from-value
-   https://blog.csdn.net/wypblog/article/details/9363861
-   https://github.com/google/guava/wiki/NewCollectionTypesExplained
-   https://guava.dev/releases/23.0/api/docs/com/google/common/collect/Multimap.html
