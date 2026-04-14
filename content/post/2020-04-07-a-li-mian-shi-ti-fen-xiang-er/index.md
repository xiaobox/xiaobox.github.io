---
title: "阿里面试题分享(二)"
slug: 2020-04-07-a-li-mian-shi-ti-fen-xiang-er
description: "这道题由于是从网上看到的，具体出自阿里哪个部门不详。题目描述：使用“生产者-消费者模式”编写代码实现：线程A"
date: 2020-04-07T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-07-a-li-mian-shi-ti-fen-xiang-er/cover.jpg
original_url: https://mp.weixin.qq.com/s/Bml0CrDp9ED2PZnajytImQ
categories:
  - 行业与思考
tags:
  - Java
  - 面试
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-07-a-li-mian-shi-ti-fen-xiang-er/001-488ca04f.jpg)

这道题由于是从网上看到的，具体出自阿里哪个部门不详。

题目描述：

**使用“生产者-消费者模式”编写代码实现：线程A随机间隔（10~200ms）按顺序生成1到100的数字（共100个），放到某个队列中。**

**线程B、C、D即时消费这些数据：**

-   **线程B消费所有被3整除的数，**

-   **线程C消费所有被5整除的数，**

-   **其它的由线程D进行消费。**

**线程BCD消费这些数据时在控制台中打印出来，**
要求按顺序打印这些数据。限时40分钟，可以查API

这里有一个网友的答案：

-   https://www.jianshu.com/p/adc70b51ca06

我的答案：

```cpp
package com.oho.alg;

import java.util.PrimitiveIterator.OfLong;
import java.util.Random;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import lombok.SneakyThrows;

public class Producer implements Runnable {

  private BlockingQueue<Integer> queue;

  private OfLong longs = new Random().longs(10, 200).iterator();

  public Producer(BlockingQueue<Integer> queue) {

    this.queue = queue;

  }

  @SneakyThrows
  @Override
  public void run() {

    for (int i = 1; i <= 100; i++) {

      queue.put(i);
      System.out.println("生产了：" + i);

      try {
        TimeUnit.MILLISECONDS.sleep(longs.nextLong());
      } catch (InterruptedException e) {
        e.printStackTrace();
      }

    }

  }

}

package com.oho.alg;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Consumer {

  private Lock lock = new ReentrantLock();
  
  private Condition cc3 = lock.newCondition();
  private Condition cc5 = lock.newCondition();
  private Condition ccn = lock.newCondition();

  private BlockingQueue<Integer> queue;

  public Consumer(BlockingQueue<Integer> queue) {

    this.queue = queue;

  }

  public void c3() {

    try {
      lock.lock();

      while (true) {

        if (queue.peek() != null) {

          while (queue.peek() % 3 != 0) {
            cc3.await();

          }
          System.out.println("消费3的倍数: " + queue.poll());
          cc5.signal();
          ccn.signal();

        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }

  }

  public void c5() {

    try {
      lock.lock();

      while (true) {

        if (queue.peek() != null) {

          while (queue.peek() % 5 != 0) {
            cc5.await();
          }
          System.out.println("消费5的倍数: " + queue.poll());
          cc3.signal();
          ccn.signal();

        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }

  }

  public void other() {

    try {
      lock.lock();

      while (true) {

        if (queue.peek() != null) {

          while (queue.peek() % 3 == 0 || queue.peek() % 5 == 0) {
            ccn.await();
          }

          System.out.println("消费other倍数: " + queue.poll());
          cc3.signal();
          cc5.signal();

        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }

  }

  public static void main(String[] args) throws InterruptedException {

    ArrayBlockingQueue<Integer> queue = new ArrayBlockingQueue<>(100);
    Consumer consumer = new Consumer(queue);
    new Thread(new Producer(queue)).start();
    new Thread(() -> consumer.c3()).start();
    new Thread(() -> consumer.c5()).start();
    new Thread(() -> consumer.other()).start();

  }
}

```

这题看起来挺简单的，但实际写的时候还是有一些点需要注意，尤其是对condition的使用。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-07-a-li-mian-shi-ti-fen-xiang-er/002-b1790c3b.png)

synchronized与wait()和nitofy()/notifyAll()方法相结合可以实现等待/通知模型，ReentrantLock同样可以，但是需要借助Condition，且Condition有更好的灵活性，具体体现在：

1、一个Lock里面可以创建多个Condition实例，实现多路通知

2、notify()方法进行通知时，被通知的线程是Java虚拟机随机选择的，但是ReentrantLock结合Condition可以实现有选择性地通知，这是非常重要的

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-07-a-li-mian-shi-ti-fen-xiang-er/003-42df053f.jpg)

关注公众号 获取更多精彩内容
