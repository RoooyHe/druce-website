// rspress.config.ts
import { defineConfig } from "@rspress/core";
import ghPages from "rspress-plugin-gh-pages";
import mermaid from 'rspress-plugin-mermaid';

export default defineConfig({
  root: "docs",
  title: "Druce",
  description: "AI 投研助手",
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/RoooyHe/druce-website",
      },
    ],
    footer: {
      message:
        "Released under the MIT License. Copyright &copy; 2026 Druce",
    },
  },
  markdown: {
    showLineNumbers: true,
  },
  llms: true,
  plugins: [
    ghPages({
      // 你的仓库地址，必填
      repo: "https://github.com/RoooyHe/druce-website.git",
      // 可选：指定推送到的分支，默认为 'gh-pages'
      branch: "gh-pages",
      // 可选：如果你的仓库不是 <用户名>.github.io，则需要设置站点基础路径
      // 例如，仓库名为 'my-project'，则设置为 '/my-project/'
      siteBase: "/druce-website/",
    }),
    mermaid()
  ],
});
