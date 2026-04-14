---
title: "跟着 Guava 学 Java 之 集合工具类"
slug: 2022-08-21-gen-zhe-guava-xue-java-zhi-ji-he-gong-ju-lei
description: "背景先来回顾一下 JDK 的 Collections  ， java.util.Collections 提供"
date: 2022-08-21T14:01:41.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-21-gen-zhe-guava-xue-java-zhi-ji-he-gong-ju-lei/cover.jpg
original_url: https://mp.weixin.qq.com/s/CVC8VhNYEvUVKd0HKI8DQw
categories:
  - 后端
tags:
  - Java
---
## 背景

先来回顾一下 JDK 的 `Collections`  ， `java.util.Collections` 提供了一系列静态方法，能更方便地操作各种集合。

比如：

-   创建空集合 Collections.emptyList();
-   创建单元素集合 Collections.singletonList("apple");
-   排序 Collections.sort(list);
-   创建不可变集合 Collections.unmodifiableList(mutable);
-   创建线程安全集合  Collections.synchronizedList(list);
-   ......

Guava  沿着 Collections 的思路 提供了 更多的工具方法，适用于所有集合的静态方法，使之成为更强大的集合工具类。

Guava 提供的集合工具不止是对 Collections 的扩展和增强，还包括了其他集合类型的工具类，我们把工具类与特定集合接口的对应关系归纳如下：

| Interface | JDK or Guava? | 对应 Guava 工具类 |
| --- | --- | --- |
| `Collection` | JDK | `Collections2` |
| `List` | JDK | `Lists` |
| `Set` | JDK | `Sets` |
| `SortedSet` | JDK | `Sets` |
| `Map` | JDK | `Maps` |
| `SortedMap` | JDK | `Maps` |
| `Queue` | JDK | `Queues` |
| `Multiset` | Guava | `Multisets` |
| `Multimap` | Guava | `Multimaps` |
| `BiMap` | Guava | `Maps` |
| `Table` | Guava | `Tables` |

## 静态构造器

在 JDK 7 之前，构造新的范型集合时要讨厌地重复声明范型：

```java
List<TypeThatsTooLongForItsOwnGood> list = new ArrayList<TypeThatsTooLongForItsOwnGood>();

```

JDK 7 以后因为有了钻石操作符（Diamond Operator）可以自动推断参数类型，所以省点儿事儿

```
List<TypeThatsTooLongForItsOwnGood> list = new ArrayList<>();

```

用 Guava 可以这样写：

```
List<TypeThatsTooLongForItsOwnGood> list = Lists.newArrayList();

```

你可能觉得：这没什么牛的呀，跟 JDK7 以后没啥区别呀，人家还是原生的。

是的，没错，尤其是你用 JDK 9 以后的版本，JDK 从功能上跟 Guava 就基本一样了，举个例子，比如带元素初始化：

```
List<String> theseElements = Lists.newArrayList("alpha", "beta", "gamma");

```

上面这行是利用了 Guava 的 Lists ，JDK 7 没有比这行代码更好的方法，但 JDK9 人家有，比如：

```
List<String> theseElements2 = List.of("alpha", "beta", "gamma");

```

**所以我们说，跟着 Guava 学 Java，随着版本的迭代，你觉得哪个好用，哪个适合你用哪个，我的重要是把这里面的知识点讲清楚。**

我们再来看个例子：创建集合时指定初始化集合大小：

```
List<Type> exactly100 = Lists.newArrayListWithCapacity(100);

```

你可能说，哥们，这 JDK 有啊，这不多此一举吗？

```
ArrayList<Object> objects = new ArrayList<>(10);

```

是的，作用一样，但 Guava 的做法，**可以利用工厂方法名称，提高代码的可读性**，你不觉得虽然名字长了，但可读性比 JDK 那个好很多吗？代码不止是写给机器的，也是写给人看的，不能指望团队里所有人都是强者。代码可读性越高，越健壮越容易维护。

## Iterables

Iterables 类包含了一系列的静态方法，来操作或返回 Iterable 对象

看几个常用的方法：

| 方法 | 描述 |
| --- | --- |
| concat(Iterable) | 串联多个 iterables 的懒视图 |
| frequency(Iterable, Object) | 返回对象在 iterable 中出现的次数 |
| partition(Iterable, int) | 把 iterable 按指定大小分割，得到的子集都不能进行修改操作 |
| getFirst(Iterable, T default) | 返回 iterable 的第一个元素，若 iterable 为空则返回默认值 |
| getLast(Iterable) | 返回 iterable 的最后一个元素，若 iterable 为空则抛出 NoSuchElementException |
| elementsEqual(Iterable, Iterable) | 如果两个 iterable 中的所有元素相等且顺序一致，返回 true |
| unmodifiableIterable(Iterable) | 返回 iterable 的不可变视图 |
| limit(Iterable, int) | 最多返回指定数量的元素 |
| getOnlyElement(Iterable) | 获取 iterable 中唯一的元素，如果 iterable 为空或有多个元素，则快速失败 |

对于上面这些常用的方法，可能你觉得使用 JDK8 以后的 Stream 一行也都搞定了，是的，还是那句话，Guava 是个工具，尤其在 JDK8 之前用来增强 API 很好用，但工具不止一个，Java 也在发展，有些东西就变成可选项了，看你的需求和习惯使用。Guava 也有对应的流式风格的工具类，比如 `FluentIterable`

## Lists

除了静态工厂方法和函数式编程方法，`Lists`为 List 类型的对象提供了若干工具方法。

| **方法** | **描述** |
| --- | --- |
| `partition(List, int)` | 把 List 按指定大小分割 |
| `reverse(List)` | 返回给定 List 的反转视图。注：如果 List 是不可变的，考虑改用`ImmutableList.reverse()`。 |

```
List countUp = Ints.asList(1, 2, 3, 4, 5);
List countDown = Lists.reverse(theList); // {5, 4, 3, 2, 1}
List<List> parts = Lists.partition(countUp, 2);//{{1,2}, {3,4}, {5}}

```

## Sets

`Sets`工具类包含了若干好用的方法。

Sets 中 为我们提供了很多标准的**集合运算**（Set-Theoretic）方法。比如我们常用的集合的 “**交、并、差**集” 以及对称差集

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-21-gen-zhe-guava-xue-java-zhi-ji-he-gong-ju-lei/001-f330b24f.jpg)

### 交集

```
Set<String> wordsWithPrimeLength = ImmutableSet.of("one", "two", "three", "six", "seven", "eight");
Set<String> primes = ImmutableSet.of("two", "three", "five", "seven");
SetView<String> intersection = Sets.intersection(primes,wordsWithPrimeLength);
// intersection 包含"two", "three", "seven"
return intersection.immutableCopy();//可以使用交集，但不可变拷贝的读取效率更高

```

### 并集

```
Set<String> wordsWithPrimeLength = ImmutableSet.of("one", "two", "three", "six", "seven", "eight");
Set<String> primes = ImmutableSet.of("two", "three", "five", "seven");
SetView<String> union = Sets.union(primes,wordsWithPrimeLength);

// union 包含 [two, three, five, seven, one, six, eight]
return intersection.immutableCopy();

```

### 差集

```
Set<String> wordsWithPrimeLength = ImmutableSet.of("one", "two", "three", "six", "seven", "eight");
Set<String> primes = ImmutableSet.of("two", "three", "five", "seven");
SetView<String> difference = Sets.union(primes,wordsWithPrimeLength);

// difference 包含 “five”
return difference.immutableCopy();

```

### 对称差集

```
Set<String> wordsWithPrimeLength = ImmutableSet.of("one", "two", "three", "six", "seven", "eight");
Set<String> primes = ImmutableSet.of("two", "three", "five", "seven");
SetView<String> symmetricDifference = Sets.union(primes,wordsWithPrimeLength);

// symmetricDifference 包含 [five, one, six, eight]
return symmetricDifference.immutableCopy();

```

注意返回的都是 `SetView` ，它可以：

-   直接当作 Set 使用，因为 SetView 也实现了 Set 接口
-   用`copyInto(Set)`拷贝进另一个可变集合
-   用`immutableCopy()`对自己做不可变拷贝

### 笛卡儿积

| **方法** | **描述** |
| --- | --- |
| `cartesianProduct(List<Set>)` | 返回所有集合的笛卡儿积 |
| `powerSet(Set)` | 返回给定集合的所有子集 |

```
Set<String> animals = ImmutableSet.of("gerbil", "hamster");
Set<String> fruits = ImmutableSet.of("apple", "orange", "banana");

Set<List<String>> product = Sets.cartesianProduct(animals, fruits);
// {{"gerbil", "apple"}, {"gerbil", "orange"}, {"gerbil", "banana"},
//  {"hamster", "apple"}, {"hamster", "orange"}, {"hamster", "banana"}}

Set<Set<String>> animalSets = Sets.powerSet(animals);
// {{}, {"gerbil"}, {"hamster"}, {"gerbil", "hamster"}}

```

## Maps

Maps 有若干很酷的方法。

### uniqueIndex

有一组对象，它们在某个属性上分别有独一无二的值，而我们希望能够按照这个属性值查找对象。

比方说，我们有一堆字符串，这些字符串的长度都是独一无二的，而我们希望能够按照特定长度查找字符串：

```
ImmutableMap<Integer, String> stringsByIndex = Maps.uniqueIndex(strings,
    new Function<String, Integer> () {
        public Integer apply(String string) {
            return string.length();
        }
 });

```

你可以想到了，我们常见的场景还有 把一个 List 的对象集合转成 Map，map 的 key 通常是对象的 ID。用 uniqueIndex 方法可以这样写：

```
 Map<Integer, Animal> map = Maps.uniqueIndex(list, Animal::getId);

```

或者你用 Java8 的 Stream 也一样：

```
  ArrayList<Animal> animals = Lists.newArrayList(new Animal(1L, "Dog"), new Animal(2L, "Cat"));
  //下面两种写法都可以
  Map<Long, Animal> map = animals.stream().collect(Collectors.toMap(Animal::getId, Function.identity()));
  Map<Long, Animal> map = animals.stream().collect(Collectors.toMap(Animal::getId, animal -> animal));

```

注意：key 要是唯一的，否则会报错。

### **difference**

找不同，对比两个 map，告诉你哪里不同

`Maps.difference(Map, Map)`用来比较两个 Map 以获取所有不同点。该方法返回 MapDifference 对象

下面是 MapDifference 的一些方法：

| `entriesInCommon()` | 两个 Map 中都有的映射项，包括匹配的键与值 |
| --- | --- |
| `entriesDiffering()` | 键相同但是值不同值映射项。返回的 Map 的值类型为`MapDifference.ValueDifference`，以表示左右两个不同的值 |
| `entriesOnlyOnLeft()` | 键只存在于左边 Map 的映射项 |
| `entriesOnlyOnRight()` | 键只存在于右边 Map 的映射项 |

```
Map<String, Integer> left = ImmutableMap.of("a", 1, "b", 2, "c", 3);
Map<String, Integer> right = ImmutableMap.of("b", 2, "c", 4, "d", 5);
MapDifference<String, Integer> diff = Maps.difference(left, right);

diff.entriesInCommon(); // {"b" => 2}
diff.entriesDiffering(); // {"c" => (3, 4)}
diff.entriesOnlyOnLeft(); // {"a" => 1}
diff.entriesOnlyOnRight(); // {"d" => 5}

```

看到这个你能想到什么？我举个场景：**审计日志或操作日志，谁什么时间做了什么，数据从旧值变更为新值，这些要记录下来**

是不是可以用上面这个 Maps 的方法？适合不适合你自己决定，这里是提供个思路。

## MultiSets

> “
> 
> 下面要介绍的工具类都是新集合类型的工具类，比如 MultiSet 和 MultiMap 之类的，有关这些 Guava 的新集合类型，在之前的文章 《跟着 Guava 学 Java 之 新集合类型》 都有介绍，有不清楚的可以再翻回去看一看。
> 
> ”

标准的 Collection 操作会忽略 Multiset 重复元素的个数，而只关心元素是否存在于 Multiset 中，如 containsAll 方法。为此，`Multisets`提供了若干方法，以顾及 Multiset 元素的重复性：

| **方法** | **说明** | \*\*和 Collection \*\*方法的区别 |
| --- | --- | --- |
| `containsOccurrences(Multiset sup, Multiset sub)` | 对任意 o，如果 sub.count(o)<=super.count(o)，返回 true | Collection.containsAll 忽略个数，而只关心 sub 的元素是否都在 super 中 |
| `removeOccurrences(Multiset removeFrom, Multiset toRemove)` | 对 toRemove 中的重复元素，仅在 removeFrom 中删除相同个数。 | Collection.removeAll 移除所有出现在 toRemove 的元素 |
| `retainOccurrences(Multiset removeFrom, Multiset toRetain)` | 修改 removeFrom，以保证任意 o 都符合 removeFrom.count(o)<=toRetain.count(o) | Collection.retainAll 保留所有出现在 toRetain 的元素 |
| `intersection(Multiset, Multiset)` | 返回两个 multiset 的交集； | 没有类似方法 |

举例来说：

```
Multiset<String> multiset1 = HashMultiset.create();
multiset1.add("a", 2);

Multiset<String> multiset2 = HashMultiset.create();
multiset2.add("a", 5);

multiset1.containsAll(multiset2); //返回 true；因为包含了所有不重复元素，
//虽然 multiset1 实际上包含 2 个"a"，而 multiset2 包含 5 个"a"
Multisets.containsOccurrences(multiset1, multiset2); // returns false

multiset2.removeOccurrences(multiset1); // multiset2 现在包含 3 个"a"
multiset2.removeAll(multiset1);//multiset2 移除所有"a"，虽然 multiset1 只有 2 个"a"
multiset2.isEmpty(); // returns true

```

Multisets 中的其他工具方法还包括：

| `copyHighestCountFirst(Multiset)` | 返回 Multiset 的不可变拷贝，并将元素按重复出现的次数做降序排列 |
| --- | --- |
| `unmodifiableMultiset(Multiset)` | 返回 Multiset 的只读视图 |
| `unmodifiableSortedMultiset(SortedMultiset)` | 返回 SortedMultiset 的只读视图 |

```
Multiset<String> multiset = HashMultiset.create();
multiset.add("a", 3);
multiset.add("b", 5);
multiset.add("c", 1);

ImmutableMultiset highestCountFirst = Multisets.copyHighestCountFirst(multiset);
//highestCountFirst，包括它的 entrySet 和 elementSet，按{"b", "a", "c"}排列元素

```

## Multimaps

### index

Multimaps 的 index 方法跟前面介绍的 Maps.uniqueIndex 方法是兄弟方法。与 uniqueIndex 方法相反，通常针对的场景是：有一组对象，它们有共同的特定属性，我们希望按照这个属性的值查询对象，但属性值不一定是独一无二的。比方说，我们想把字符串按长度分组：

```java
ImmutableSet digits = ImmutableSet.of("zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine");
Function<String, Integer> lengthFunction = new Function<String, Integer>() {
    public Integer apply(String string) {
        return string.length();
    }
};

ImmutableListMultimap<Integer, String> digitsByLength= Multimaps.index(digits, lengthFunction);
/*
*  digitsByLength maps:
*  3 => {"one", "two", "six"}
*  4 => {"zero", "four", "five", "nine"}
*  5 => {"three", "seven", "eight"}
*/

```

### invertFrom

Multimap 可以把多个键映射到同一个值，也可以把一个键映射到多个值，反转 Multimap 也会很有用。Guava 提供了`invertFrom(Multimap toInvert, Multimap dest)`做这个操作，并且你可以自由选择反转后的 Multimap 实现。

```
ArrayListMultimap<String, Integer> multimap = ArrayListMultimap.create();
multimap.putAll("b", Ints.asList(2, 4, 6));
multimap.putAll("a", Ints.asList(4, 2, 1));
multimap.putAll("c", Ints.asList(2, 5, 3));

TreeMultimap<Integer, String> inverse = Multimaps.invertFrom(multimap, TreeMultimap<String, Integer>.create());
//注意我们选择的实现，因为选了 TreeMultimap，得到的反转结果是有序的
/*
* inverse maps:
*  1 => {"a"}
*  2 => {"a", "b", "c"}
*  3 => {"c"}
*  4 => {"a", "b"}
*  5 => {"c"}
*  6 => {"b"}
*/

```

### forMap

想在 Map 对象上使用 Multimap 的方法吗？`forMap(Map)`把 Map 包装成 SetMultimap。这个方法特别有用，例如，与 Multimaps.invertFrom 结合使用，可以把多对一的 Map 反转为一对多的 Multimap。

```
Map<String, Integer> map = ImmutableMap.of("a", 1, "b", 1, "c", 2);
SetMultimap<String, Integer> multimap = Multimaps.forMap(map);
// multimap：["a" => {1}, "b" => {1}, "c" => {2}]
Multimap<Integer, String> inverse = Multimaps.invertFrom(multimap, HashMultimap<Integer, String>.create());
// inverse：[1 => {"a","b"}, 2 => {"c"}] 

```

## 参考

-   https://www.baeldung.com/java-list-to-map
-   https://wizardforcel.gitbooks.io/guava-tutorial/content/11.html
