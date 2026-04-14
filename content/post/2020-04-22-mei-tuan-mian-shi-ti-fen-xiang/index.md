---
title: "美团面试题分享"
slug: 2020-04-22-mei-tuan-mian-shi-ti-fen-xiang
description: "以下两道题是本人几年前面试遇到过的真实面试题"
date: 2020-04-22T08:51:09.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-22-mei-tuan-mian-shi-ti-fen-xiang/cover.jpg
original_url: https://mp.weixin.qq.com/s/TSxysf8Vbb3oPnp3qhNW_g
categories:
  - 行业与思考
tags:
  - Java
  - 数据结构
  - 面试
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-22-mei-tuan-mian-shi-ti-fen-xiang/001-9ff71926.png)

以下两道题是本人几年前面试遇到过的真实面试题，由于当年刷题不够，思路也不到位，导致没有答好。今天正好刷LeetCode，看到原题了，勾起了我的回忆......

**1  给定一棵二叉树，找到每一行中的最大值。
**

输入: 

```properties
         / \
        3   2
       / \   \  
      5   3   9

```java

输出: [1, 3, 9]

LeetCode原题，题号是515。

先说答案：

```cs
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public List<Integer> largestValues(TreeNode root) {

        List<Integer> res  =new ArrayList<>();

        Queue<TreeNode>  q = new LinkedList<>();

        if (root ==null ){
            return res;
        }
        q.add(root);

        while(!q.isEmpty()){

            int size = q.size();

            int max = Integer.MIN_VALUE;

            for(int i = 0; i<size; i++){

               TreeNode node = q.poll();
               max = Math.max(max,node.val);

               if (node.left !=null){
                   q.add(node.left);
               }

               if (node.right !=null){
                   q.add(node.right);
               }

            }

            res.add(max);
        }        
        return res;
    }

}

```

是的，就是利用队列做BFS，有关二叉树层次遍历的思路都可以套用。

**2  手写 hashmap的put方法**

我不知道多少人能写出来，说实话直到现在我也写不出来。但冷静下来细想，人家真的是考你能不能完全写出来吗？我想，可能还是考查你对于put的熟悉程序，对流程的把握，如果你把基本流程用伪代码讲清楚了，怎么也能答到及格吧。有关这个问题的解读可以看小盒子之前的文章：

[一次性搞定HashMap面试](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484249&idx=1&sn=fddb98d346845cb42740b8fdc5bb05fe&chksm=eb6dbcdfdc1a35c90a0e31c43ad9a1a9378685801b4ad632b276c7682f1f5da8b6ee64c183a9&scene=21#wechat_redirect)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-22-mei-tuan-mian-shi-ti-fen-xiang/002-f2e7317d.jpg)

关注公众号 获取更多精彩内容
