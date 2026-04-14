---
title: "快手一面（高级java）面试真题分享"
slug: 2020-05-06-kuai-shou-yi-mian-gao-ji-java-mian-shi-zhen-ti-fen-xiang
date: 2020-05-06T10:37:03.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-06-kuai-shou-yi-mian-gao-ji-java-mian-shi-zhen-ti-fen-xiang/cover.jpg
original_url: https://mp.weixin.qq.com/s/ihUYEQ97Bhzcg8wr9BAy8A
categories:
  - 后端
tags:
  - Java
  - Redis
  - 算法
  - 数据结构
  - 面试
  - 多线程
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-06-kuai-shou-yi-mian-gao-ji-java-mian-shi-zhen-ti-fen-xiang/001-ad0a6a34.png)

###

### 1 ArrayList LinkedList 区别

  ArrayList

-   采用数组的方式来存储对象

-   非线程安全

-   每次按照1.5倍（位运算）的比率通过copeOf的方式扩容

-   初始数组容量为10

  LinkedList

-   基于双向链表机制实现

-   非线程安全的

### 2 ArrayList、LinkedList 的boolean add(E e) 、E remove(int index)、void add(int index, E element) 三个方法，分别的时间复杂度

  ArrayList:

-    add(E e)  在不考虑扩容的情况下时间复杂度为：O(1)

-    add(int index,E element)  时间复杂度为：O(n)  在第几个元素后面插入，后面的元素需要向后移动

-    remove(int index)  时间复杂度为：O(n)   在第几个元素后面插入，后面的元素需要向后移动

 LinkedList:

-    add(E e)  时间复杂度为：O(1)

-    add(int index,E element)  时间复杂度为：O(n)  需要先查找到第几个元素，直接指针指向操作

-    remove(int index)  时间复杂度为：O(n) 

  总结：

-   ArrayList 对于随机位置的add/remove，时间复杂度为 O(n),但是对于列表末尾的添加/删除操作,时间复杂度是 O(1). 

-   LinkedList对于随机位置的add/remove，时间复杂度为 O(n),但是对于列表 末尾/开头 的添加/删除操作,时间复杂度是 O(1).

### 3 HashMap 数据结构，1.8为什么用红黑树?

###      参考系列文章：[经典面试题之HashMap(一)](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484239&idx=1&sn=370298f66cfb9b85df7420cb09a5ce2e&chksm=eb6dbcc9dc1a35df77495c0718c3b59f6eae1eef449ab3f0ad23884533a8173de073458cf2d3&scene=21#wechat_redirect)

### 4 HashMap 求hash值的算法？

###        参考系列文章 : [经典面试题之HashMap(二)](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484244&idx=1&sn=6df3488ca359fac892456fabdeb6520a&chksm=eb6dbcd2dc1a35c406ff444c029edb87aa8db8abc83b9e53dde392b113c3093cf3187cf25342&scene=21#wechat_redirect)[](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484249&idx=1&sn=fddb98d346845cb42740b8fdc5bb05fe&chksm=eb6dbcdfdc1a35c90a0e31c43ad9a1a9378685801b4ad632b276c7682f1f5da8b6ee64c183a9&scene=21#wechat_redirect)

### 5 写代码：实现一下HashMap的put方法

      这个题我说实话，我自己是无法完整的写出来，但大致思路是能说得上来。所以，如果我是面试官的话，要求至少是把思路说出来。能完全写出来的佩服，因为put方法还牵扯很多上下文的信息，这些都记住不易。

###        参考系列文章：[一次性搞定HashMap面试](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484249&idx=1&sn=fddb98d346845cb42740b8fdc5bb05fe&chksm=eb6dbcdfdc1a35c90a0e31c43ad9a1a9378685801b4ad632b276c7682f1f5da8b6ee64c183a9&scene=21#wechat_redirect)

### 6 说明一下java的异常体系

![Image](002-197d97f2.png "image.png")

![Image](003-f98354eb.png "image.png")

### 7  Redis 怎样实现分布式锁? setnx  和 set区别

     用setnx 可以实现分布式锁

     set:

-   将字符串值 value 关联到 key 。

-   如果 key 已经持有其他值， SET 就覆写旧值，无视类型。

     setnx:

-   将 key 的值设为 value ，当且仅当 key 不存在。

-   若给定的 key 已经存在，则 SETNX 不做任何动作。

-   SETNX 是『SET if Not eXists』(如果不存在，则 SET)的简写。

### 8 一个接口调用次数 ，如果用 static long counter；counter++; 统计有什么问题没有？如果用volatile修饰呢？

     有问题，如果在多线程环境下，会出现数据不对的情况。

     如果用volatile也不能解决这个问题，因为volatile 虽然能够保证有序性和可见性，但就这个例子来讲，运算的结果已经依赖当前变量的值了（counter++） 这样是不能使用volatile的，如果用了，结果也是不对。原因是在counter++中,这条语句编译后的字节码指令不是一句，在多线程环境下其他线程可能已经把值改了，操作数栈顶的值可能就成了过期的数据。 

     **那应该怎么办呢？**

     可以用原子类操作，比如 AtomicInteger

     **AtomicInteger的原理？**

     主要是利用了CAS

     **描述下CAS过程和原理？**

所谓CAS，即“比较与交换”（Compare-and-swap），是最常见的乐观锁实现方式，看官应该对这个概念很熟悉。一次CAS过程是原子的，包含3个操作数：

-   需要访问的内存地址V；

-   该内存地址中存储的预期值A；

-   希望向该地址写入的新值B。

当且仅当V中的值与A相同时，其值才会更新成B，否则就不执行任何动作。

      CAS通过调用JNI的代码实现的。JNI:Java Native Interface为JAVA本地调用，允许java调用其他语言。而compareAndSwapInt就是借助C来调用CPU底层指令(Atomic::cmpxchg(x,addr,e))实现的。

     **CAS存在的问题？**

     如果CAS失败，会一直进行尝试。如果CAS长时间一直不成功，可能会给CPU带来很大的开销。

### 9  讲一讲熟悉的项目
