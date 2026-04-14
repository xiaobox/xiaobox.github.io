---
title: "彻底搞懂AQS"
slug: 2020-04-18-che-di-gao-dong-aqs
description: "AQSAQS 核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资"
date: 2020-04-18T02:24:35.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/cover.jpg
original_url: https://mp.weixin.qq.com/s/0l_9AHRNALtgPiYOmNrAIw
categories:
  - 后端
tags:
  - Java
  - 数据结构
  - 多线程
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/001-6c7d2bcb.png)

## AQS

**AQS 核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制 AQS 是用 CLH 队列锁实现的，即将暂时获取不到锁的线程加入到队列中。**

AQS定义了两种资源获取方式：独占（只有一个线程能访问执行，又根据是否按队列的顺序分为公平锁和非公平锁，如ReentrantLock） 和共享（多个线程可同时访问执行，如Semaphore/CountDownLatch，Semaphore、CountDownLatCh、 CyclicBarrier ）。ReentrantReadWriteLock 可以看成是组合式，允许多个线程同时对某一资源进行读。

AQS底层使用了模板方法模式， **自定义同步器在实现时只需要实现共享资源 state 的获取与释放方式即可，至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS已经在上层已经帮我们实现好了。**

同步器的可重写方法

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/002-91605e5f.png)

同步器的模板方法

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/003-e0879cee.png)

**AQS框架：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/004-71ac542b.png)

**AQS模型如下图：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/005-4bb7bb3a.png)

**双向链表中，第一个节点为虚节点，其实并不存储任何信息，只是占位。真正的第一个有数据的节点，是在第二个节点开始的。**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/006-42ff499e.png)

-   AQS state字段（int类型，32位），该字段用来描述有多少线程持有锁。

-   在独享锁中这个值通常是0或者1（如果是重入锁的话state值就是重入的次数),在共享锁中state就是持有锁的数量.

-   我们发现在ReentrantLock虽然有公平锁和非公平锁两种，但是它们添加的都是独享锁。根据源码所示，当某一个线程调用lock方法获取锁时，如果同步资源没有被其他线程锁住，那么当前线程在使用CAS更新state成功后就会成功抢占该资源。而如果公共资源被占用且不是被当前线程占用，那么就会加锁失败。所以可以确定ReentrantLock无论读操作还是写操作，添加的锁都是都是独享锁。

## ReentrantReadWriteLock

在ReentrantReadWriteLock中有读、写两把锁，所以需要在一个整型变量state上分别描述读锁和写锁的数量（或者也可以叫状态）。**于是将state变量“按位切割”切分成了两个部分，高16位表示读锁状态（读锁个数），低16位表示写锁状态（写锁个数**）

![Image](007-a628c3e3.png "image.png")

获取写锁源码:

```java
/**
         * 获取写锁
           Acquires the write lock.
         *  如果此时没有任何线程持有写锁或者读锁，那么当前线程执行CAS操作更新status，
         *  若更新成功，则设置读锁重入次数为1，并立即返回
         * <p>Acquires the write lock if neither the read nor write lock
         * are held by another thread
         * and returns immediately, setting the write lock hold count to
         * one.
         *  如果当前线程已经持有该写锁，那么将写锁持有次数设置为1，并立即返回
         * <p>If the current thread already holds the write lock then the
         * hold count is incremented by one and the method returns
         * immediately.
         *  如果该锁已经被另外一个线程持有，那么停止该线程的CPU调度并进入休眠状态，
         *  直到该写锁被释放，且成功将写锁持有次数设置为1才表示获取写锁成功
         * <p>If the lock is held by another thread then the current
         * thread becomes disabled for thread scheduling purposes and
         * lies dormant until the write lock has been acquired, at which
         * time the write lock hold count is set to one.
         */
        public void lock() {
            sync.acquire(1);
        }
/**
     * 该方法为以独占模式获取锁，忽略中断
     * 如果调用一次该“tryAcquire”方法更新status成功，则直接返回，代表抢锁成功
     * 否则，将会进入同步队列等待，不断执行“tryAcquire”方法尝试CAS更新status状态，直到成功抢到锁
     * 其中“tryAcquire”方法在NonfairSync(公平锁)中和FairSync(非公平锁)中都有各自的实现
     *
     * Acquires in exclusive mode, ignoring interrupts.  Implemented
     * by invoking at least once {@link #tryAcquire},
     * returning on success.  Otherwise the thread is queued, possibly
     * repeatedly blocking and unblocking, invoking {@link
     * #tryAcquire} until success.  This method can be used
     * to implement method {@link Lock#lock}.
     *
     * @param arg the acquire argument.  This value is conveyed to
     *        {@link #tryAcquire} but is otherwise uninterpreted and
     *        can represent anything you like.
     */
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
    protected final boolean tryAcquire(int acquires) {
            /*
             * Walkthrough:
             * 1、如果读写锁的计数不为0，且持有锁的线程不是当前线程，则返回false
             * 1. If read count nonzero or write count nonzero
             *    and owner is a different thread, fail.
             * 2、如果持有锁的计数不为0且计数总数超过限定的最大值，也返回false
             * 2. If count would saturate, fail. (This can only
             *    happen if count is already nonzero.)
             * 3、如果该锁是可重入或该线程在队列中的策略是允许它尝试抢锁，那么该线程就能获取锁
             * 3. Otherwise, this thread is eligible for lock if
             *    it is either a reentrant acquire or
             *    queue policy allows it. If so, update state
             *    and set owner.
             */
            Thread current = Thread.currentThread();
            //获取读写锁的状态
            int c = getState();
            //获取该写锁重入的次数
            int w = exclusiveCount(c);
            //如果读写锁状态不为0，说明已经有其他线程获取了读锁或写锁
            if (c != 0) {
                //如果写锁重入次数为0，说明有线程获取到读锁，根据“读写锁互斥”原则，返回false
                //或者如果写锁重入次数不为0，且获取写锁的线程不是当前线程，根据"写锁独占"原则，返回false
                // (Note: if c != 0 and w == 0 then shared count != 0)
                if (w == 0 || current != getExclusiveOwnerThread())
                    return false;
               //如果写锁可重入次数超过最大次数（65535），则抛异常
                if (w + exclusiveCount(acquires) > MAX_COUNT)
                    throw new Error("Maximum lock count exceeded");
                //到这里说明该线程是重入写锁，更新重入写锁的计数(+1)，返回true
                // Reentrant acquire
                setState(c + acquires);
                return true;
            }
            //如果读写锁状态为0,说明读锁和写锁都没有被获取，会走下面两个分支：
            //如果要阻塞或者执行CAS操作更新读写锁的状态失败，则返回false
            //如果不需要阻塞且CAS操作成功，则当前线程成功拿到锁，设置锁的owner为当前线程，返回true
            if (writerShouldBlock() ||
                !compareAndSetState(c, c + acquires))
                return false;
            setExclusiveOwnerThread(current);
            return true;
        }

```

释放写锁源码:

```java
/*
  * Note that tryRelease and tryAcquire can be called by
  * Conditions. So it is possible that their arguments contain
  * both read and write holds that are all released during a
  * condition wait and re-established in tryAcquire.
  */
 protected final boolean tryRelease(int releases) {
     //若锁的持有者不是当前线程，抛出异常
     if (!isHeldExclusively())
         throw new IllegalMonitorStateException();
     //写锁的可重入计数减掉releases个
     int nextc = getState() - releases;
     //如果写锁重入计数为0了，则说明写锁被释放了
     boolean free = exclusiveCount(nextc) == 0;
     if (free)
        //若写锁被释放，则将锁的持有者设置为null，进行GC
        setExclusiveOwnerThread(null);
     //更新写锁的重入计数
     setState(nextc);
     return free;
 }

```

获取读锁源码：

```cs
/**
         * 获取读锁
         * Acquires the read lock.
         * 如果写锁未被其他线程持有，执行CAS操作更新status值，获取读锁后立即返回
         * <p>Acquires the read lock if the write lock is not held by
         * another thread and returns immediately.
         *
         * 如果写锁被其他线程持有，那么停止该线程的CPU调度并进入休眠状态，直到该读锁被释放
         * <p>If the write lock is held by another thread then
         * the current thread becomes disabled for thread scheduling
         * purposes and lies dormant until the read lock has been acquired.
         */
        public void lock() {
            sync.acquireShared(1);
        }
   /**
     * 该方法为以共享模式获取读锁，忽略中断
     * 如果调用一次该“tryAcquireShared”方法更新status成功，则直接返回，代表抢锁成功
     * 否则，将会进入同步队列等待，不断执行“tryAcquireShared”方法尝试CAS更新status状态，直到成功抢到锁
     * 其中“tryAcquireShared”方法在NonfairSync(公平锁)中和FairSync(非公平锁)中都有各自的实现
     * (看这注释是不是和写锁很对称)
     * Acquires in shared mode, ignoring interrupts.  Implemented by
     * first invoking at least once {@link #tryAcquireShared},
     * returning on success.  Otherwise the thread is queued, possibly
     * repeatedly blocking and unblocking, invoking {@link
     * #tryAcquireShared} until success.
     *
     * @param arg the acquire argument.  This value is conveyed to
     *        {@link #tryAcquireShared} but is otherwise uninterpreted
     *        and can represent anything you like.
     */
    public final void acquireShared(int arg) {
        if (tryAcquireShared(arg) < 0)
            doAcquireShared(arg);
    }
    protected final int tryAcquireShared(int unused) {
            /*
             * Walkthrough:
             * 1、如果已经有其他线程获取到了写锁，根据“读写互斥”原则，抢锁失败，返回-1
             * 1.If write lock held by another thread, fail.
             * 2、如果该线程本身持有写锁，那么看一下是否要readerShouldBlock，如果不需要阻塞，
             *    则执行CAS操作更新state和重入计数。
             *    这里要注意的是，上面的步骤不检查是否可重入(因为读锁属于共享锁，天生支持可重入)
             * 2. Otherwise, this thread is eligible for
             *    lock wrt state, so ask if it should block
             *    because of queue policy. If not, try
             *    to grant by CASing state and updating count.
             *    Note that step does not check for reentrant
             *    acquires, which is postponed to full version
             *    to avoid having to check hold count in
             *    the more typical non-reentrant case.
             * 3、如果因为CAS更新status失败或者重入计数超过最大值导致步骤2执行失败
             *    那就进入到fullTryAcquireShared方法进行死循环，直到抢锁成功
             * 3. If step 2 fails either because thread
             *    apparently not eligible or CAS fails or count
             *    saturated, chain to version with full retry loop.
             */

            //当前尝试获取读锁的线程
            Thread current = Thread.currentThread();
            //获取该读写锁状态
            int c = getState();
            //如果有线程获取到了写锁 ，且获取写锁的不是当前线程则返回失败
            if (exclusiveCount(c) != 0 &&
                getExclusiveOwnerThread() != current)
                return -1;
            //获取读锁的重入计数
            int r = sharedCount(c);
            //如果读线程不应该被阻塞，且重入计数小于最大值，且CAS执行读锁重入计数+1成功，则执行线程重入的计数加1操作，返回成功
            if (!readerShouldBlock() &&
                r < MAX_COUNT &&
                compareAndSetState(c, c + SHARED_UNIT)) {
                //如果还未有线程获取到读锁，则将firstReader设置为当前线程，firstReaderHoldCount设置为1
                if (r == 0) {
                    firstReader = current;
                    firstReaderHoldCount = 1;
                } else if (firstReader == current) {
                    //如果firstReader是当前线程，则将firstReader的重入计数变量firstReaderHoldCount加1
                    firstReaderHoldCount++;
                } else {
                    //否则说明有至少两个线程共享读锁，获取共享锁重入计数器HoldCounter
                    //从HoldCounter中拿到当前线程的线程变量cachedHoldCounter，将此线程的重入计数count加1
                    HoldCounter rh = cachedHoldCounter;
                    if (rh == null || rh.tid != getThreadId(current))
                        cachedHoldCounter = rh = readHolds.get();
                    else if (rh.count == 0)
                        readHolds.set(rh);
                    rh.count++;
                }
                return 1;
            }
            //如果上面的if条件有一个都不满足，则进入到这个方法里进行死循环重新获取
            return fullTryAcquireShared(current);
        }
        /**
         * 用于处理CAS操作state失败和tryAcquireShared中未执行获取可重入锁动作的full方法(补偿方法？)
         * Full version of acquire for reads, that handles CAS misses
         * and reentrant reads not dealt with in tryAcquireShared.
         */
        final int fullTryAcquireShared(Thread current) {
            /*
             * 此代码与tryAcquireShared中的代码有部分相似的地方，
             * 但总体上更简单，因为不会使tryAcquireShared与重试和延迟读取保持计数之间的复杂判断
             * This code is in part redundant with that in
             * tryAcquireShared but is simpler overall by not
             * complicating tryAcquireShared with interactions between
             * retries and lazily reading hold counts.
             */
            HoldCounter rh = null;
            //死循环
            for (;;) {
                //获取读写锁状态
                int c = getState();
                //如果有线程获取到了写锁
                if (exclusiveCount(c) != 0) {
                    //如果获取写锁的线程不是当前线程，返回失败
                    if (getExclusiveOwnerThread() != current)
                        return -1;
                    // else we hold the exclusive lock; blocking here
                    // would cause deadlock.
                } else if (readerShouldBlock()) {//如果没有线程获取到写锁，且读线程要阻塞
                    // Make sure we're not acquiring read lock reentrantly
                    //如果当前线程为第一个获取到读锁的线程
                    if (firstReader == current) {
                        // assert firstReaderHoldCount > 0;
                    } else { //如果当前线程不是第一个获取到读锁的线程(也就是说至少有有一个线程获取到了读锁)
                        //
                        if (rh == null) {
                            rh = cachedHoldCounter;
                            if (rh == null || rh.tid != getThreadId(current)) {
                                rh = readHolds.get();
                                if (rh.count == 0)
                                    readHolds.remove();
                            }
                        }
                        if (rh.count == 0)
                            return -1;
                    }
                }
                /**
                 *下面是既没有线程获取写锁，当前线程又不需要阻塞的情况
                 */
                //重入次数等于最大重入次数，抛异常
                if (sharedCount(c) == MAX_COUNT)
                    throw new Error("Maximum lock count exceeded");
                //如果执行CAS操作成功将读写锁的重入计数加1，则对当前持有这个共享读锁的线程的重入计数加1，然后返回成功
                if (compareAndSetState(c, c + SHARED_UNIT)) {
                    if (sharedCount(c) == 0) {
                        firstReader = current;
                        firstReaderHoldCount = 1;
                    } else if (firstReader == current) {
                        firstReaderHoldCount++;
                    } else {
                        if (rh == null)
                            rh = cachedHoldCounter;
                        if (rh == null || rh.tid != getThreadId(current))
                            rh = readHolds.get();
                        else if (rh.count == 0)
                            readHolds.set(rh);
                        rh.count++;
                        cachedHoldCounter = rh; // cache for release
                    }
                    return 1;
                }
            }
        }

```java

释放读锁源码：

```java
/**
  * Releases in shared mode.  Implemented by unblocking one or more
  * threads if {@link #tryReleaseShared} returns true.
  *
  * @param arg the release argument.  This value is conveyed to
  *        {@link #tryReleaseShared} but is otherwise uninterpreted
  *        and can represent anything you like.
  * @return the value returned from {@link #tryReleaseShared}
  */
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {//尝试释放一次共享锁计数
        doReleaseShared();//真正释放锁
        return true;
    }
        return false;
}
/**
 *此方法表示读锁线程释放锁。
 *首先判断当前线程是否为第一个读线程firstReader，
 *若是，则判断第一个读线程占有的资源数firstReaderHoldCount是否为1，
  若是，则设置第一个读线程firstReader为空，否则，将第一个读线程占有的资源数firstReaderHoldCount减1；
  若当前线程不是第一个读线程，
  那么首先会获取缓存计数器（上一个读锁线程对应的计数器 ），
  若计数器为空或者tid不等于当前线程的tid值，则获取当前线程的计数器，
  如果计数器的计数count小于等于1，则移除当前线程对应的计数器，
  如果计数器的计数count小于等于0，则抛出异常，之后再减少计数即可。
  无论何种情况，都会进入死循环，该循环可以确保成功设置状态state
 */
protected final boolean tryReleaseShared(int unused) {
      // 获取当前线程
      Thread current = Thread.currentThread();
      if (firstReader == current) { // 当前线程为第一个读线程
          // assert firstReaderHoldCount > 0;
         if (firstReaderHoldCount == 1) // 读线程占用的资源数为1
              firstReader = null;
          else // 减少占用的资源
              firstReaderHoldCount--;
     } else { // 当前线程不为第一个读线程
         // 获取缓存的计数器
         HoldCounter rh = cachedHoldCounter;
         if (rh == null || rh.tid != getThreadId(current)) // 计数器为空或者计数器的tid不为当前正在运行的线程的tid
             // 获取当前线程对应的计数器
             rh = readHolds.get();
         // 获取计数
         int count = rh.count;
         if (count <= 1) { // 计数小于等于1
             // 移除
             readHolds.remove();
             if (count <= 0) // 计数小于等于0，抛出异常
                 throw unmatchedUnlockException();
         }
         // 减少计数
         --rh.count;
     }
     for (;;) { // 死循环
         // 获取状态
         int c = getState();
         // 获取状态
         int nextc = c - SHARED_UNIT;
         if (compareAndSetState(c, nextc)) // 比较并进行设置
             // Releasing the read lock has no effect on readers,
             // but it may allow waiting writers to proceed if
             // both read and write locks are now free.
             return nextc == 0;
     }
 }
 /**真正释放锁
  * Release action for shared mode -- signals successor and ensures
  * propagation. (Note: For exclusive mode, release just amounts
  * to calling unparkSuccessor of head if it needs signal.)
  */
private void doReleaseShared() {
        /*
         * Ensure that a release propagates, even if there are other
         * in-progress acquires/releases.  This proceeds in the usual
         * way of trying to unparkSuccessor of head if it needs
         * signal. But if it does not, status is set to PROPAGATE to
         * ensure that upon release, propagation continues.
         * Additionally, we must loop in case a new node is added
         * while we are doing this. Also, unlike other uses of
         * unparkSuccessor, we need to know if CAS to reset status
         * fails, if so rechecking.
         */
        for (;;) {
            Node h = head;
            if (h != null && h != tail) {
                int ws = h.waitStatus;
                if (ws == Node.SIGNAL) {
                    if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                        continue;            // loop to recheck cases
                    unparkSuccessor(h);
                }
                else if (ws == 0 &&
                         !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                    continue;                // loop on failed CAS
            }
            if (h == head)                   // loop if head changed
                break;
        }
    }

```java

**对同一个线程来说（可重入），在线程持有读锁的情况下，该线程不能取得写锁****(因为获取写锁的时候，如果发现当前的读锁被占用，就马上获取失败，不管读锁是不是被当前线程持有)。**

**对同一个线程来说（可重入），在线程持有写锁的情况下，该线程可以继续获取读锁****（获取读锁时如果发现写锁被占用，只有写锁没有被当前线程占用的情况才会获取失败）。**

**• 读锁使用的是共享锁，多个读锁可以一起获取锁，互相不会影响，即读读不互斥；**

**• 读写、写读和写写是会互斥的（****多线程情况****），前者占有着锁，后者需要进入AQS队列中排队；**

**• 多个连续的读线程是一个接着一个被唤醒的，而不是一次性唤醒所有读线程；**

**• 只有多个读锁都完全释放了才会唤醒下一个写线程；**

**• 只有写锁完全释放了才会唤醒下一个等待者，这个等待者有可能是读线程，也可能是写线程；**

**• 读写所允许同一时刻被多个读线程访问，但是在写线程访问时，所有的读线程和其他的写线程都会被阻塞。**

**• 读写锁保证了写操作对后续的读操作的可见性**

**• 锁降级：遵循获取写锁，获取读锁再释放写锁的次序，写锁能够降级为读锁**

锁降级指的是写锁降级成为读锁。如果当前线程拥有写锁，然后将其释放，最后再获取读锁，这种分段完成的过程不能称之为锁降级。锁降级是指把持住（当前拥有的）写锁，再获取到读锁，随后释放（先前拥有的）写锁的过程。

```cs
public void processData() {
        readLock.lock();
        if (!update) {
            // 必须先释放读锁
            readLock.unlock();
            // 锁降级从写锁获取到开始
            writeLock.lock();
            try {
                if (!update) {
                    // 准备数据的流程（略）
                    update = true;
                }
                readLock.lock();
            } finally {
                writeLock.unlock();
            }// 锁降级完成，写锁降级为读锁
        }
        try {// 使用数据的流程（略）
        } finally {
            readLock.unlock();
        }
    }

```

参考

-   https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html

-   https://tech.meituan.com/2018/11/15/java-lock.html

-   [https://mp.weixin.qq.com/s/h3VIUyH9L0v14MrQJiiDbw](https://mp.weixin.qq.com/s?__biz=MzU4NzU0MDIzOQ==&mid=2247488891&idx=1&sn=227928446c692aaa0085557682ed732d&scene=21#wechat_redirect)

-   https://www.cnblogs.com/waterystone/p/4920797.html

-   https://www.cnblogs.com/chengxiao/archive/2017/07/24/7141160.html

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-18-che-di-gao-dong-aqs/008-001cd8cd.jpg)

关注公众号 获取更多精彩内容
