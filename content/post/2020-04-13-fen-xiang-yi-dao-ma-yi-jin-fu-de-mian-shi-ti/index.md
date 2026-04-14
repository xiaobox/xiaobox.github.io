---
title: "分享一道蚂蚁金服的面试题"
slug: 2020-04-13-fen-xiang-yi-dao-ma-yi-jin-fu-de-mian-shi-ti
description: "这是一道蚂蚁金服二面的编程题题目：交替打印零与奇偶数给定什么问题一个数nums,然后交替打印出奇偶数。"
date: 2020-04-13T13:16:13.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-13-fen-xiang-yi-dao-ma-yi-jin-fu-de-mian-shi-ti/cover.jpg
original_url: https://mp.weixin.qq.com/s/l3KjWaioCYlNygXvgfA0pg
categories:
  - 行业与思考
tags:
  - Java
  - 面试
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-13-fen-xiang-yi-dao-ma-yi-jin-fu-de-mian-shi-ti/001-6f10a400.png)

这是一道蚂蚁金服二面的编程题

**题目：交替打印零与奇偶数**

给定一个数nums,然后交替打印出奇偶数。输出的长度为2nums,

你应该：至少用两种方法实现，并分析出优劣势。

举例：

输入：nums = 3

输出： "010203"

这道题与我之前分享的另外一道比较像 题目在这里 ：[阿里面试题分享(二)](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484294&idx=1&sn=0cad49b5a1fdeed20f00092da5a117f2&chksm=eb6dbc00dc1a35169e726826ae2182280ed9a31697a35c11d404ce5a344abf8ae7aee2e9f42b&scene=21#wechat_redirect)

但实际上比那道要简单些。因为没有要求写几个线程。

第一种解法：Lock+Condition

```cs
package com.oho.alg;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class PrintNums {

  public final Lock lock = new ReentrantLock();
  public Condition c0 = lock.newCondition();
  public Condition c1 = lock.newCondition();
  public int flag = 0;

  private void print0(int num) {

    lock.lock();
    try {

      for (int i = 1; i <= num; i++) {
        if (flag == 0) {
          System.out.print(0);
          flag = 1;
          c1.signal();
          c0.await();
        }

      }

    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }

  }

  private void print(int num) {

    lock.lock();
    try {

      for (int i = 1; i <= num; i++) {
        if (flag == 1) {

          System.out.print(i);
          flag = 0;
          c0.signal();

          if (i < num) {
            c1.await();
          }

        }

      }

    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }

  }

  public void printNumsWithNum(int num) {

    long start = System.currentTimeMillis();

    Thread t1 = new Thread(() -> print0(num));
    Thread t2 = new Thread(() -> print(num));

    t1.start();
    t2.start();

    try {
      t1.join();
      t2.join();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println();
    System.out.println("===============================================");
    System.out.println("运行时长: " + (System.currentTimeMillis() - start));

  }

  public static void main(String[] args) {

    new PrintNums().printNumsWithNum(10);

  }
}

```java

第二种解法：Semaphore

```cs
package com.oho.alg;

import java.util.concurrent.Semaphore;

public class PrintNumsUseSemaphore {

  public Semaphore s1 = new Semaphore(1);
  public Semaphore s2 = new Semaphore(0);

  private void print0(int num) {

    try {

      for (int i = 1; i <= num; i++) {
        //获取信号量，s1 - 1
        s1.acquire();
        System.out.print(0);
        //释放信号量，s2 + 1
        s2.release();
      }

    } catch (InterruptedException e) {
      e.printStackTrace();
    }

  }

  private void print(int num) {

    try {
      for (int i = 1; i <= num; i++) {
        //获取信号量，s2 - 1
        s2.acquire();
        System.out.print(i);
        //释放信号量，s1 + 1
        s1.release();
      }

    } catch (InterruptedException e) {
      e.printStackTrace();
    }

  }

  public void printNumsWithNum(int num) {

    long start = System.currentTimeMillis();

    Thread t1 = new Thread(() -> print0(num));
    Thread t2 = new Thread(() -> print(num));

    t1.start();
    t2.start();

    try {
      t1.join();
      t2.join();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println();
    System.out.println("===============================================");
    System.out.println("运行时长: " + (System.currentTimeMillis() - start));

  }

  public static void main(String[] args) {

    new PrintNumsUseSemaphore().printNumsWithNum(10);

  }
}

```

优劣势的话，如果在比较小的数据量下看不出来，我用nums = 800000,进行了测试：

<table><tbody><tr><td width="268" valign="top" style="word-break: break-all;">Lock+Condition<br></td><td width="268" valign="top" style="word-break: break-all;">运行时长: 9588&nbsp;毫秒</td></tr><tr><td width="268" valign="top" style="word-break: break-all;"><span style="color: rgb(0, 0, 0);">Semaphore</span></td><td width="268" valign="top" style="word-break: break-all;">运行时长: 9013 毫秒</td></tr></tbody></table>

随着nums的增大，Lock+Condition的运行时长比Semaphore越短。看起来Lock+Condition的性能更好些。至于为什么，因为涉及到锁的原理，这里就不多了，需要大家去看看源码，翻翻资料了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-13-fen-xiang-yi-dao-ma-yi-jin-fu-de-mian-shi-ti/002-f2e7317d.jpg)

关注公众号 获取更多精彩内容
