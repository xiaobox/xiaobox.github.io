---
title: "JUC 包中的 Atomic 原子类总结"
slug: 2020-04-08-juc-bao-zhong-de-atomic-yuan-zi-lei-zong-jie
description: "一 概述根据操作的数据类型，可以将JUC包中的原子类分为5类基本类型 使用原子的方式更新基本类型Atomic"
date: 2020-04-08T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-08-juc-bao-zhong-de-atomic-yuan-zi-lei-zong-jie/cover.jpg
original_url: https://mp.weixin.qq.com/s/M7y7D3rPT4PjrufyLLzAOQ
categories:
  - 后端
tags:
  - Java
  - 多线程
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-08-juc-bao-zhong-de-atomic-yuan-zi-lei-zong-jie/001-4b23479f.png)

## 一 概述

根据操作的数据类型，可以将JUC包中的原子类分为5类

-   **基本类型** 使用原子的方式更新基本类型

-   AtomicInteger：整形原子类

-   AtomicLong：长整型原子类

-   AtomicBoolean ：布尔型原子类

-   **数组类型** 使用原子的方式更新数组里的某个元素

-   AtomicIntegerArray：整形数组原子类

-   AtomicLongArray：长整形数组原子类

-   AtomicReferenceArray ：引用类型数组原子类

-   **引用类型**

-   AtomicReference：引用类型原子类

-   AtomicStampedRerence：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于解决原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。

-   AtomicMarkableReference ：原子更新带有标记位的引用类型

-   **对象的属性修改类型**

-   AtomicIntegerFieldUpdater:原子更新整形字段的更新器

-   AtomicLongFieldUpdater：原子更新长整形字段的更新器

-   AtomicReferenceFieldUpdater ：原子更新引用类型里的字段的更新器

-   **JDK1.8新增**

-   DoubleAccumulator

-   LongAccumulator

-   DoubleAdder

-   LongAdder

JDK1.8新增的部分，是对AtomicLong等类的改进。比如LongAccumulator与LongAdder在高并发环境下比AtomicLong更高效。

## 二 分类详细介绍 

### 1 基本类型 

   基本类型中三个类提供的方法几乎相同，所以我们这里以 AtomicInteger 为例子来介绍。

```cs
class Test2 {

    private AtomicInteger count = new AtomicInteger();
    public void increment() {
        count.incrementAndGet();
    }
    //使用AtomicInteger之后，不需要加锁，就可以实现线程安全。
    public int getCount() {
        return count.get();
    }
}

```java

-   多线程环境使用原子类保证线程安全

-   AtomicInteger 类主要利用 CAS (compare and swap) + volatile 和 native 方法来保证原子操作，从而避免 synchronized 的高开销，执行效率大为提升。

### 2 数组类型

    数组类型三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerArray 为例子来介绍。

```cs
import java.util.concurrent.atomic.AtomicIntegerArray;

public class Demo
{
    static AtomicIntegerArray atom = new AtomicIntegerArray(a);
    public static void main(String[] agrs)
    {
        int[] a = {1, 2, 3, 4, 5};

        System.out.println("原始数组：" + atom);

        System.out.println("调用addAndGet(1, 9)方法返回值：" + atom.addAndGet(1, 9));
        System.out.println("调用后数组为：" + atom);

        System.out.println("调用getAndDecrement(2)方法返回值：" + atom.getAndDecrement(2));
        System.out.println("调用后数组为：" + atom);

        System.out.println("调用incrementAndGet(3)方法返回值：" + atom.incrementAndGet(3));
        System.out.println("调用后数组为：" + atom);

        System.out.println("调用compareAndSet(4, 5, 100)方法返回值：" + atom.compareAndSet(4, 5, 100));
        System.out.println("调用后数组为：" + atom);
    }
}

```java

-   实现原理：简单来说还是使用sun.misc.Unsafe通过CAS操作来完成线程安全的数组操作

-   多线程环境下需要对整形数组中的单个值执行原子更新时使用 AtomicIntegerArray。

-   可以存放int数值的原子性数组，以整个数组对象为单位，里面的元素操作都是原子性的

### 3 引用类型

     **基本类型原子类只能更新一个变量，如果需要原子更新多个变量，需要使用引用类型原子类。**

     引用类型三个类提供的方法几乎相同，所以我们这里以 AtomicReference 为例子来介绍。

```cs
import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceTest {

    public static void main(String[] args) {
        AtomicReference<Person> ar = new AtomicReference<Person>();
        Person person = new Person("SnailClimb", 22);
        ar.set(person);
        Person updatePerson = new Person("Daisy", 20);
        ar.compareAndSet(person, updatePerson);

        System.out.println(ar.get().getName());
        System.out.println(ar.get().getAge());
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

}

```

上述代码首先创建了一个 Person 对象，然后把 Person 对象设置进 AtomicReference 对象中，然后调用 compareAndSet 方法，该方法就是通过 CAS 操作设置 ar。如果 ar 的值为 person 的话，则将其设置为 updatePerson。实现原理与 AtomicInteger 类中的 compareAndSet 方法相同。运行上面的代码后的输出结果如下：

```nginx
Daisy
20

```java

-   AtomicStampedReference通过一个pair来保存初始化引用和计数器，以后每次原子操作时，都需要比较引用和计数器是否都正确。

-   AtomicMarkableReference跟AtomicStampedReference差不多，AtomicStampedReference是使用pair的int stamp作为计数器使用，AtomicMarkableReference的pair使用的是boolean mark。

> 举个通俗点的例子，你倒了一杯水放桌子上，干了点别的事，然后同事把你水喝了又给你重新倒了一杯水，你回来看水还在，拿起来就喝，如果你不管水中间被人喝过，只关心水还在，这就是ABA问题。如果你是一个讲卫生讲文明的小伙子，不但关心水在不在，还要在你离开的时候水被人动过没有，因为你是程序员，所以就想起了放了张纸在旁边，写上初始值0，别人喝水前麻烦先做个累加才能喝水。这就是AtomicStampedReference的解决方案。还是那个水的例子，AtomicStampedReference可能关心的是动过几次，AtomicMarkableReference关心的是有没有被人动过，方法都比较简单。

### 4 对象的属性修改类型

     如果需要原子更新某个类里的某个字段时，需要用到对象的属性修改类型原子类。

     三个类提供的方法几乎相同，所以我们这里以 AtomicIntegerFieldUpdater为例子来介绍。

要想原子地更新对象的属性需要两步：

**第一步**，因为对象的属性修改类型原子类都是抽象类，所以每次使用都必须使用静态方法 newUpdater()创建一个更新器，并且需要设置想要更新的类和属性。

**第二步**，更新的对象属性必须使用 public volatile 修饰符。

```cs
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;

public class AtomicIntegerFieldUpdaterTest {
    public static void main(String[] args) {
        AtomicIntegerFieldUpdater<User> a = AtomicIntegerFieldUpdater.newUpdater(User.class, "age");

        User user = new User("Java", 22);
        System.out.println(a.getAndIncrement(user));// 22
        System.out.println(a.get(user));// 23
    }
}

class User {
    private String name;
    public volatile int age;

    public User(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

}

//输出结果 
22
23

```

### 5 JDK1.8新增

-   DoubleAccumulator

-   LongAccumulator

-   DoubleAdder

-   LongAdder

  以上这四个类分两组，Double和Long ，我们只讲Long的，Double的类似。

 我们先说下LongAdder,都说LongAdder是AtomicLong的更高效版本，来看看javaDoc是怎么说的：

```kotlin
 * <p>This class is usually preferable to {@link AtomicLong} when
 * multiple threads update a common sum that is used for purposes such
 * as collecting statistics, not for fine-grained synchronization
 * control.  Under low update contention, the two classes have similar
 * characteristics. But under high contention, expected throughput of
 * this class is significantly higher, at the expense of higher space
 * consumption.

```java

> 当多个线程更新用于诸如收集统计信息而不是用于细粒度的同步控制之类的公共和时，此类通常比AtomicLong更可取。在低更新争用下，两个类具有相似的特征。但是在竞争激烈的情况下，此类的预期吞吐量会大大提高，但要消耗更多的空间。

很明显LongAdder其适用于统计计数的场景，例如计算qps这种场景。在高并发场景下，qps这个值会被多个线程频繁更新的，所以LongAdder很适合。所以其更适合使用在**多线程统计计数的场景下**，在这个限定的场景下比AtomicLong要高效一些。其他低频场景下不一定能替换AtomicLong。

**为什么高效？**

LongAdder所使用的思想就是热点分离，这一点可以类比一下**ConcurrentHashMap**的设计思想。就是将value值分离成一个数组，当多线程访问时，通过hash算法映射到其中的一个数字进行计数。而最终的结果，就是这些数组的求和累加。这样一来，就减小了锁的粒度。如下图所示：

![Image](002-35963ef5.png "image.png")

**LongAccumulator**是LongAdder的功能增强版。LongAdder的API只有对数值的加减，而LongAccumulator提供了自定义的函数操作。

```cs
  // accumulatorFunction：需要执行的二元函数（接收2个long作为形参，并返回1个long）；identity：初始值
    public LongAccumulator(LongBinaryOperator accumulatorFunction, long identity) {
        this.function = accumulatorFunction;
        base = this.identity = identity;
    }

```java

上面构造函数，accumulatorFunction：需要执行的二元函数（接收2个long作为形参，并返回1个long）；identity：初始值。下面看一个Demo：

```java
public class LongAccumulatorDemo {

    // 找出最大值
    public static void main(String[] args) throws InterruptedException {
        LongAccumulator accumulator = new LongAccumulator(Long::max, Long.MIN_VALUE);
        Thread[] ts = new Thread[1000];

        for (int i = 0; i < 1000; i++) {
            ts[i] = new Thread(() -> {
                Random random = new Random();
                long value = random.nextLong();
                accumulator.accumulate(value); // 比较value和上一次的比较值，然后存储较大者
            });
            ts[i].start();
        }
        for (int i = 0; i < 1000; i++) {
            ts[i].join();
        }
        System.out.println(accumulator.longValue());
    }
}

```

从上面代码可以看出，accumulate(value)传入的值会与上一次的比较值对比，然后保留较大者，最后打印出最大值。

参考 ：《Java并发编程的艺术》《Java高并发程序设计》

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-08-juc-bao-zhong-de-atomic-yuan-zi-lei-zong-jie/003-42df053f.jpg)

关注公众号 获取更多精彩内容
