> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/development/local-dev.md.

# 本地开发

本页讲清楚在本地改 Druce 代码或文档时需要的命令与规范。

## Python 代码

### 安装开发依赖

`pyproject.toml` 的 `dev` 可选依赖包含 `ruff` 和 `pytest`：

```bash
uv sync --extra dev
```

### 代码规范

用 [ruff](https://docs.astral.sh/ruff/) 做静态检查与格式化：

```bash
# 检查
uv run ruff check app/

# 自动修复
uv run ruff check --fix app/

# 格式化
uv run ruff format app/
```

?> 提交前跑一次 `ruff check`，CI 也会跑同一套规则。

### 测试

```bash
uv run pytest
```

目前项目尚无测试套件。新增功能时建议同步补测试，测试文件放 `tests/` 目录，命名 `test_*.py`。

### 运行应用

```bash
uv run python run.py
```

修改 `app/` 下代码后，Streamlit 支持热重载——在浏览器右上角点 "Rerun" 或按 `R` 即可刷新。

## 文档站

### 本地预览

```bash
cd druce-website
bun run dev
```

默认起在 `http://localhost:5173`。改 `docs/` 下任何 `.md` / `.mdx` 文件，Rspress 会热更新。

### 写作规范

本项目文档统一用 **GFM + Rspress 提示框**：

| 语法      | 含义 | 用途        |
| :------ | :- | :-------- |
| `!> 内容` | 警告 | 危险操作、易踩坑点 |
| `T> 内容` | 提示 | 技巧、可选优化   |
| `?> 内容` | 详情 | 折叠的补充说明   |

代码块默认显示行号（`rspress.config.ts` 中 `markdown.showLineNumbers: true`）。

### 构建产物不入库

`druce-website/doc_build/` 是 Rspress 构建产物，已在 `.gitignore` 中忽略。部署由 `rspress-plugin-gh-pages` 直接推 `gh-pages` 分支，无需本地构建产物入库。

!> 不要手动把 `doc_build/` 提交到版本库，会让 PR diff 噪声极大。

## 完整本地开发循环

1. `uv sync --extra dev` — 装 Python 依赖
2. `cd druce-website && bun install` — 装文档站依赖（首次）
3. 改代码或文档
4. `uv run ruff check app/` — 检查代码
5. `uv run pytest` — 跑测试（如有）
6. `cd druce-website && bun run dev` — 预览文档变更
7. 提交 PR

> 部署流程参见 [部署](/druce-website/development/deployment.md)。
