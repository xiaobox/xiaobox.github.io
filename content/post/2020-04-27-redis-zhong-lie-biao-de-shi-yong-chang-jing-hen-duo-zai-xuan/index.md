---
title: "Redis中列表的使用场景很多，在选择时可以参考以下口决：\nlpush + lpop = Stack(栈)\nlpush + rpop = Queue(队列)\nlpush + ltrim = Capped Collection(有限集合)\nlpush + brpop = Message Queue(消息队列)"
slug: 2020-04-27-redis-zhong-lie-biao-de-shi-yong-chang-jing-hen-duo-zai-xuan
date: 2020-04-27T08:59:42.000Z
original_url: https://mp.weixin.qq.com/s/cYEc-BGMhtTCjzPbhdqMlQ
categories:
  - 数据库
tags:
  - Redis
---
Redis中列表的使用场景很多，在选择时可以参考以下口决：
lpush + lpop = Stack(栈)
lpush + rpop = Queue(队列)
lpush + ltrim = Capped Collection(有限集合)
lpush + brpop = Message Queue(消息队列)
