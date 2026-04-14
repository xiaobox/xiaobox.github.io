---
title: "centos7 使用kubeadm 安装 k8s集群"
slug: 2021-03-21-centos7-shi-yong-kubeadm-an-zhuang-k8s-ji-qun
description: "centos7 使用kubeadm k8s集群安装"
date: 2021-03-21T10:56:34.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-03-21-centos7-shi-yong-kubeadm-an-zhuang-k8s-ji-qun/cover.jpg
original_url: https://mp.weixin.qq.com/s/Uv7N2qJT_WMDnsn_Slz0eA
categories:
  - 云原生
tags:
  - Kubernetes
  - Docker
  - Linux
  - Vim
  - 网络
---
## 环境

-   centos 7.6
-   k8s 1.13.4
-   3台机器 1台master 2台worker

## 准备工作

### 关闭swap

执行swapoff临时关闭swap。重启后会失效，若要永久关闭，可以编辑/etc/fstab文件，将其中swap分区一行注释掉

至于为什么关闭这里有个说明：`https://github.com/kubernetes/kubernetes/issues/53533`，亦有说影响性能的 `https://www.zhihu.com/question/374752553`

### 关闭防火墙和selinux

根据文档来的:`https://kubernetes.io/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/`

```
# 将 SELinux 设置为 permissive 模式（相当于将其禁用）
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

```

### 开放端口

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-03-21-centos7-shi-yong-kubeadm-an-zhuang-k8s-ji-qun/001-dfefcdc1.jpg)

### 允许 iptables 检查桥接流量

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system

```

## 安装docker（全部节点）

### 安装

```
#安装需要的工具
yum install -y yum-utils   device-mapper-persistent-data   lvm2
#设置源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
#查看有哪些docker版本
yum list docker-ce --showduplicates | sort -r
#安装特定的版本
yum makecache fast && yum install -y docker-ce-18.09.8-3.el7 docker-ce-cli-18.09.8-3.el7 containerd.io-1.2.0-3.el7
#启动docker
systemctl daemon-reload && systemctl restart docker
#设置为开机启动
systemctl enable docker.service

```

### 修改Docker默认存储位置

```json
systemctl stop docker 或者 service docker stop
 
#然后移动整个/var/lib/docker目录到目的路径：
mv /var/lib/docker /home/data/docker
ln -s /home/data/docker /var/lib/docker
#reload配置文件
systemctl daemon-reload
#重启docker
systemctl restart docker.service
#设置docker 开机启动
systemctl enable docker
 
//当然你也可以通过修改配置文件的方式
vim /etc/docker/daemon.json
 
{"registry-mirrors": ["http://7e61f7f9.m.daocloud.io"],"graph": "/new-path/docker"}

```

### 阿里云镜像加速

```bash
#访问：https://cr.console.aliyun.com/cn-beijing/instances/mirrors
#找到加速方法，如：
 
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://se35r65b.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

```

## 安装kubeadm, kubelet和kubectl(master和worker都装)

### 添加 yum 仓库 创建/etc/yum.repos.d/kubernetes.repo，文件如下内容

```
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg

```

### 安装  kubelet kubectl 和 kubeadm

```
yum install -y kubelet-1.13.4 kubeadm-1.13.4 kubectl-1.13.4 kubernetes-cni-0.6.0 
systemctl enable --now kubelet

```

### 从阿里云手动摘取镜像

执行kubeadm config images pull查 看到 gcr.io 的连接，如果拉取成功可以进入下一步。如果失败，说明无法访问 grc.io。这时需要手动拉取镜像，可以执行下面的脚本，从阿里云拉取相应镜像

```bash
#!/bin/bash
images=(
    kube-apiserver:v1.13.4
    kube-controller-manager:v1.13.4
    kube-scheduler:v1.13.4
    kube-proxy:v1.13.4
    pause:3.1
    etcd:3.2.24
    coredns:1.2.6
)
for imageName in ${images[@]} ; do
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
done

```

## 初始化（master）

### 记得加入 pod-network-cidr 因为后面的网络组件用的是flannel

```
kubeadm init --pod-network-cidr=10.244.0.0/16 --image-repository registry.aliyuncs.com/google_containers

```

### 安装成功提示

```bash
Your Kubernetes master has initialized successfully!
To start using your cluster, you need to run the following as a regular user:
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/
You can now join any number of machines by running the following on each node
as root:
  kubeadm join 10.22.9.162:6443 --token e225cp.14g848dy4vpoas75 --discovery-token-ca-cert-hash sha256:aaf9910fb2b94e8c2bc2aea0b2a08538796d8322331561ef1094bebe8a7a790f

```

### 第一次使用 Kubernetes 集群所需要的配置命令

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

```

这些配置命令的原因是：Kubernetes 集群默认需要加密方式访问。所以，这几条命令，就是将刚刚部署生成的 Kubernetes 集群的安全配置文件，保存到当前用户的.kube 目录下，kubectl 默认会使用这个目录下的授权信息访问 Kubernetes 集群。如果不这么做的话，我们每次都需要通过 `export KUBECONFIG` 环境变量告诉 kubectl 这个安全配置文件的位置。

### master节点生成其他节点加入的方式

```
kubeadm token create --print-join-command

```

### 部署 flannel 网络组件

```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/a70459be0084506e4ec919aa1c114638878db11b/Documentation/kube-flannel.yml

```

### 查看状态

```bash
# 用 kubectl get 命令来查看当前唯一一个节点的状态了
kubectl get nodes
# 用 kubectl describe 来查看这个节点（Node）对象的详细信息、状态和事件（Event）
kubectl describe node master
# 通过 kubectl get 重新检查 Pod 的状态：
kubectl get pods -n kube-system
# 部署过程中任何环节有问题都可以查看日志 
journalctl -l -u kubelet

```

### master 节点配置

-   删除master节点默认污点 taint：污点的意思。如果一个节点被打上了污点，那么pod是不允许运行在这个节点上面的 默认情况下集群不会在master上调度pod，如果偏想在master上调度Pod，可以执行如下操作：

```bash
#查看污点
kubectl describe node master|grep -i taints
#删除污点
kubectl taint nodes master node-role.kubernetes.io/master-

```

## 加入集群（worker）

利用之前master 初始化的信息加入集群

```
kubeadm join 10.22.9.162:6443 --token 43t2na.80oiehldy76rw6lz --discovery-token-ca-cert-hash sha256:67fd28cb6fd03242eda63c7a395096aba1a6784f7234a9b6269ff0941e9070e3

```

加入成功后在master查看集群状态

```bash
kubectl get nodes

```

## 安装Dashboard UI（master）

### 获得配置文件

```bash
wget https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml

```

### 手动获取镜像

```bash
docker pull anjia0532/google-containers.kubernetes-dashboard-amd64:v1.10.0
docker tag  anjia0532/google-containers.kubernetes-dashboard-amd64:v1.10.0   k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.0
docker rmi  anjia0532/google-containers.kubernetes-dashboard-amd64:v1.10.0

```

### 修改配置文件（ports部分）

```yaml
# ------------------- Dashboard Service ------------------- #
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kube-system
spec:
  type: NodePort
  ports:
    - port: 443
      targetPort: 8443
      nodePort: 30001
  selector:
    k8s-app: kubernetes-dashboard

```

### 运行并查看状态

```bash
kubectl apply -f   kubernetes-dashboard.yaml
#通过以下命令查看 pod 状态
kubectl get pods -n kubernetes-dashboard
kubectl get pods,svc -n kubernetes-dashboard

```

### 登录

```bash
##创建管理员
kubectl create serviceaccount dashboard-admin -n kube-system
kubectl create clusterrolebinding dashboard-admin --clusterrole=cluster-admin --serviceaccount=kube-system:dashboard-admin
##获取token 
kubectl describe secrets -n kube-system $(kubectl -n kube-system get secret | grep dashboard-admin | awk '{print $1}')

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-03-21-centos7-shi-yong-kubeadm-an-zhuang-k8s-ji-qun/002-bf47af4b.jpg)

## 完全清除或卸载K8s

This a gist for quick uninstall kubernetes If the cluster is node, First delete it from master

```bash
kubectl drain <node name> — delete-local-data — force — ignore-daemonsets
kubectl delete node <node name>

```

Then remove kubeadm completely

```bash
kubeadm reset 
# on debian base 
sudo apt-get purge kubeadm kubectl kubelet kubernetes-cni kube* 
#on centos base
sudo yum remove kubeadm kubectl kubelet kubernetes-cni kube*
# on debian base
sudo apt-get autoremove
#on centos base
sudo yum autoremove
 
sudo rm -rf ~/.kube

```

参考：

-   *https://www.yinxiang.com/everhub/note/f420816c-2019-47a1-8dcd-7b3ade25ac1f*

-   *https://blog.51cto.com/3241766/2405624*

-   *https://juejin.cn/post/6844904161759199240#heading-25*

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-03-21-centos7-shi-yong-kubeadm-an-zhuang-k8s-ji-qun/003-06dd59d5.gif)

关注公众号 获取更多精彩内容
