# xiaobox.github.io

[何龙(小盒子)的技术博客](https://xiaobox.github.io),也是公众号「小盒子的技术分享」的镜像归档。

主要写 AI Infra、推理平台、RAG / Agent,以及 Java、Redis、MySQL、云原生这些老本行的折腾笔记。

## 技术栈

- [Hugo](https://gohugo.io/) + [Stack 主题](https://github.com/CaiJimmy/hugo-theme-stack)
- 图床:[Cloudflare R2](https://www.cloudflare.com/products/r2/)(免费额度内)
- 部署:GitHub Pages + GitHub Actions

## 公众号同步工具

`scripts/` 目录下有一套从微信公众号同步文章到本博客的完整脚本,如果你也想把自己的公众号搬出来,可以直接拿去改。

| 脚本 | 作用 |
|---|---|
| `slugify.mjs` | 中文标题 → 拼音 slug,日期前缀 + 唯一性约束 |
| `import-wx.mjs` | 从公众号后台抓文章 HTML、解析、转 Markdown、下载图片(支持 curl 模式与 Chrome 模式) |
| `clean-md-noise.mjs` | 清理微信赞赏面板、视频卡片、数字键盘等噪音 |
| `clean-orphan-images.mjs` | 清理 force 重抓产生的孤儿图片 |
| `verify-content.mjs` | 用 Chrome 校验本地 markdown 与原文完整性 |
| `delete-empty-posts.mjs` | 删除空文章,同步清理 R2 对应图片 |
| `upload-images-r2.mjs` | 并发上传所有图片到 Cloudflare R2 |
| `rewrite-md-to-r2.mjs` | 把 markdown 里的本地图片引用改写为 R2 公开 URL |

完整搬迁过程见博客文章:[把公众号搬来这里的 N 个理由](https://xiaobox.github.io/p/2026-04-14-why-this-blog/)。

## 本地开发

```bash
git clone --recurse-submodules https://github.com/xiaobox/xiaobox.github.io
cd xiaobox.github.io
hugo server
```

访问 http://localhost:1313。

## 部署

push 到 `main` 分支会触发 GitHub Actions 自动构建并部署到 GitHub Pages。配置见 `.github/workflows/deploy.yml`。

## License

文章内容: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
代码 / 脚本: MIT
