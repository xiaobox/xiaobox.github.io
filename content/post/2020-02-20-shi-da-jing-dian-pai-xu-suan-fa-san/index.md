---
title: "十大经典排序算法（三）"
slug: 2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san
description: "十大经典排序算法（三）堆排序（Heapsort）"
date: 2020-02-20T11:45:05.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/cover.jpg
original_url: https://mp.weixin.qq.com/s/Byk9-5dnTZcjaysEzWXrgg
categories:
  - 系统底层
tags:
  - Docker
  - 算法
  - 数据结构
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/001-45ba8117.jpg)

接上文

[十大经典排序算法（一）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483844&idx=1&sn=af2a74158fd83d15f51c8e70da5d69c2&chksm=eb6dbe42dc1a3754150255bad083ba5f7155911a9144978ce4a76e219987f55a6e9200db3b6d&scene=21#wechat_redirect)

[十大经典排序算法（二）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483852&idx=1&sn=452fb838414c626059b9ef68b622e489&chksm=eb6dbe4adc1a375c8f9ec120a7d53c1a7630c551e1b93a85ad42fe11ae5413aa62a7c64b8194&scene=21#wechat_redirect)

### 7 堆排序（Heap Sort）

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似**完全二叉树**的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

-   **大顶堆**：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；

-   **小顶堆**：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)。

####  算法描述

-   将待排序序列构建成一个堆 H[0……n-1]，根据（升序降序需求）选择大顶堆或小顶堆；

-   把堆首（最大值）和堆尾互换；

-   把堆的尺寸缩小 1，并调用 shift\_down(0)，目的是把新的数组顶端数据调整到相应位置；

-   重复步骤 2，直到堆的尺寸为 1。

####  动图演示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/002-c257665b.gif)

**详解**

下图是一棵深度为4的完全二叉树

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/003-3681cb98.png)

堆（二叉堆）可以视为一棵完全的二叉树。完全二叉树的一个“优秀”的性质是，除了最底层之外，其余每一层都是满的，这使得堆可以利用数组来表示（普通的一般的二叉树通常用链表作为基本容器表示），每一个结点对应数组中的一个元素。

如下图，是一个堆和数组的相互关系。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/004-75e59b48.png)

对于给定的某个节点的下标i，可以很容易的计算出这个结点的父结点、孩子结点的下标：

-   Parent(i) = i/2       //  i  父节点的下标

-   Left(i) = 2i             //  i  左子节点的下标

-   Right(i) = 2i + 1    //  i  右子节点的下标

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/005-a323e413.png)

堆（二叉堆）又分为2种：最大堆（大顶堆）、最小堆（小顶堆）。

大顶堆

-   堆中的最大元素值出现在根结点（堆顶）

-   堆中每个父节点的元素值都大于等于其孩子结点（如果存在）

              ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/006-c41026a0.png)

小顶堆

-   堆中的最小元素值出现在根结点（堆顶）

-   堆中每个父节点的元素值都小于等于其孩子结点（如果存在）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/007-614068a5.png)

**堆排序就是把最大堆堆顶的最大数取出，将剩余的堆继续调整为最大堆，再次将堆顶的最大数取出，这个过程持续到剩余数只有一个时结束**。在堆中定义以下几种操作：

-   堆调整

-   建堆

继续进行下面的讨论前，需要注意的一个问题是：数组都是 Zero-Based，这就意味着我们的堆数据结构模型要发生改变：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/008-e4e3da5b.png)

相应的，几个计算公式也要作出相应调整：

-   Parent(i) = (i-1)/2      //  i 父节点下标

-   Left(i) = 2i + 1           //   i 左子节点下标

-   Right(i) = 2i + 2        //   i  右子节点下标

### 堆调整

最大堆调整（Max‐Heapify）的作用是保持最大堆的性质，是创建最大堆的核心子程序，过程如图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/009-1fbd52dc.png)

由于一次调整后，堆仍然违反堆性质，所以需要递归的测试，使得整个堆都满足堆性质。

```cpp
/**
   * 最大堆调整
   *
   * @param index 检查起始的下标
   * @param heapSize 堆大小
   */
  public void heapify(int[] array, int index, int heapSize) {
    int left = 2 * index + 1;// 左孩子的下标（如果存在的话）
    int right = 2 * index + 2;// 左孩子的下标（如果存在的话）
    int iMax = index;// 寻找3个节点中最大值节点的下标
    if (left < heapSize && array[left] > array[index]) {
      iMax = left;
    }
    if (right < heapSize && array[right] > array[iMax]) {
      iMax = right;
    }
    if (iMax != index) {
      swap(array, iMax, index);
      heapify(array, iMax, heapSize);
    }
  }

  public void swap(int[] array, int i, int j) {
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

```java

递归在调用递归子函数的时候，会先将传给子函数的参数压栈，然后将当前指令的下一条指令的地址压栈，以便子函数执行完后返回到原函数中继续执行，在原函数继续执行之前还涉及到清理子函数的栈。因此，递归的效率比迭代低一点点。其实上面的调整堆也可以用迭代来实现：

```cpp
public void heapify(int[] array, int index, int heapSize) {
    int left, right, iMax;
    while (true) {
      left = 2 * index + 1;// 左孩子的下标（如果存在的话）
      right = 2 * index + 2;// 左孩子的下标（如果存在的话）
      iMax = index;// 寻找3个节点中最大值节点的下标
      if (left < heapSize && array[left] > array[index]) {
        iMax = left;
      }
      if (right < heapSize && array[right] > array[iMax]) {
        iMax = right;
      }
      if (iMax != index) {
        swap(array, iMax, index);
        index = iMax;
      } else {
        break;
      }
    }
  }

```java

### 建堆

创建最大堆（Build-Max-Heap）的作用是将一个数组改造成一个最大堆，接受数组和堆大小两个参数，Build-Max-Heap 将自下而上的调用 Max-Heapify 来改造数组，建立最大堆。**因为 Max-Heapify 能够保证下标 i 的结点之后结点都满足最大堆的性质，所以自下而上的调用 Max-Heapify 能够在改造过程中保持这一性质。**如果最大堆的数量元素是 n，那么 Build-Max-Heap 从 Parent(n) 开始，往上依次调用 Max-Heapify。流程如下：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/010-04d8231a.jpg)

```cpp
public void buildHeap(int[] array) {
  int n = array.length;// 数组中元素的个数
  for (int i = n / 2 - 1; i >= 0; i--)
        heapify(array, i, n);
}

```java

### 堆排序

堆排序（Heap-Sort）先调用Build-Max-Heap将原数组改造为最大堆，这个时候堆顶元素最大，将其与堆底（当前堆对应数组的最后一个元素）交换，堆的大小减去1，当前堆堆底后面的元素已经排好序。然后，从堆顶元素开始检查，调用Max-Heapify保持最大堆性质，这样可以将第二大的元素调到堆顶，然后将其与当前堆堆底元素交换。重复这个过程n-1次，直到堆中只有1个元素为止。整个流程如下：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/011-ec54ed05.jpg)

**完整代码实现**

```java
public class HeapSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        int len = arr.length;

        buildMaxHeap(arr, len);

        for (int i = len - 1; i > 0; i--) {
            swap(arr, 0, i);
            len--;
            heapify(arr, 0, len);
        }
        return arr;
    }

    private void buildMaxHeap(int[] arr, int len) {
        for (int i = (int) Math.floor(len / 2); i >= 0; i--) {
            heapify(arr, i, len);
        }
    }

    private void heapify(int[] arr, int i, int len) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int largest = i;

        if (left < len && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < len && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != i) {
            swap(arr, i, largest);
            heapify(arr, largest, len);
        }
    }

    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

}

```

参考

-   http://lioncruise.github.io/2016/10/30/heap-sort/

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-20-shi-da-jing-dian-pai-xu-suan-fa-san/012-f3f71aa8.jpg)

**关注公众号 获取更多精彩内容**
