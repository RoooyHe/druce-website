> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/development/deployment.md.

# 部署

本页讲 Druce 文档站如何部署到 GitHub Pages。

## 部署机制

文档站基于 [Rspress](https://rspress.dev/)，通过 `rspress-plugin-gh-pages` 插件在构建时自动把产物推到 `gh-pages` 分支。

关键配置在 `druce-website/rspress.config.ts`：

```ts
plugins: [
  ghPages({
    repo: "https://github.com/RoooyHe/druce-website.git",
    branch: "gh-pages",
    siteBase: "/druce-website/",
  }),
],
```

### 配置项说明

| 配置         | 作用             | 本项目取值                   |
| :--------- | :------------- | :---------------------- |
| `repo`     | 目标 GitHub 仓库地址 | `RoooyHe/druce-website` |
| `branch`   | 推送目标分支         | `gh-pages`              |
| `siteBase` | 站点基础路径         | `/druce-website/`       |

!> `siteBase` 必须与仓库名一致。若仓库名为 `my-docs`，则 `siteBase` 应设为 `/my-docs/`。否则 GitHub Pages 上所有静态资源路径都会 404。

## 部署流程

### 生产构建

```bash
cd druce-website
bun run build:prod
```

`build:prod` 等价于 `NODE_ENV=production rspress build`。构建产物输出到 `doc_build/`，随后插件自动推送到 `gh-pages` 分支。

?> 首次部署需要 GitHub 仓库的写入权限。若推送失败，检查本地 git 凭证是否配置正确。

### 启用 GitHub Pages

1. 打开仓库 `Settings → Pages`。
2. Source 选 `Deploy from a branch`。
3. Branch 选 `gh-pages`，目录选 `/ (root)`。
4. Save 后等待几分钟，站点即可通过 `https://<username>.github.io/druce-website/` 访问。

## 验证部署

部署完成后，访问 `https://roooyhe.github.io/druce-website/`，确认：

- 首页 hero 与 feature 卡正常渲染
- 顶导 5 项均可点击且无 404
- 各页面间内部链接通畅

!> 若页面样式丢失或资源 404，首要检查 `siteBase` 是否与仓库名匹配。

## LLMs.txt 支持

`rspress.config.ts` 中 `llms: true` 开启了 [llms.txt](https://llmstxt.org/) 标准支持，构建时会生成 `llms.txt` 与 `llms-full.txt`，便于大语言模型抓取文档内容。

> 本地预览方式参见 [本地开发](/druce-website/development/local-dev.md)。
