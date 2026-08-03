---
title: 快速开始
description: 从零到跑通 Druce 初步报告模块 Demo，包含依赖安装、密钥配置、启动命令与 mock 模式说明。
---

# 快速开始

本页带你从零跑通 Druce 初步报告模块 Demo。整个过程三步：安装依赖、配置密钥（可选）、启动。

## 1. 安装依赖

Druce 用 [uv](https://docs.astral.sh/uv/) 托管 Python 依赖。

```bash
uv sync
```

`uv sync` 会自动创建 `.venv` 并安装 `pyproject.toml` 中声明的依赖（streamlit、openai、tavily-python、pydantic 等）。

?> 没装 uv？`pip install uv` 或参考 [uv 官方安装指南](https://docs.astral.sh/uv/getting-started/installation/)。

## 2. 配置密钥（可选）

无任何密钥时，Druce 自动进入 **mock 模式**，返回内置示例数据，开箱可演示。

要切换到真实联网模式，复制环境模板并填入密钥：

```bash
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY 与 TAVILY_API_KEY
```

`.env` 支持的变量：

| 变量 | 作用 | 缺省 |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | LLM 调用密钥 | 空 → 走规则拆解 + mock 报告 |
| `OPENAI_BASE_URL` | OpenAI 兼容端点 | `https://api.openai.com/v1` |
| `LLM_MODEL` | 模型名 | `gpt-3.5-turbo` |
| `TAVILY_API_KEY` | Tavily 搜索密钥 | 空 |
| `BING_API_KEY` | Bing 搜索密钥 | 空 |

!> `.env` 含真实密钥，**切勿提交到版本库**。`.gitignore` 已默认忽略 `.env`。

### 运行模式判定

`app/config.py` 中的 `Settings` 按下表判定整体模式：

| 条件 | `has_llm` | `has_search` | 行为 |
| :--- | :--- | :--- | :--- |
| 仅 LLM key | true | false | 拆解/报告走 LLM，搜索走 mock |
| 仅搜索 key | false | true | 搜索走真实 API，拆解/报告走规则兜底 |
| 两者齐全 | true | true | 全链路真实模式 |
| 两者皆无 | false | false | 全链路 mock 模式 |

## 3. 启动

```bash
uv run python run.py
# 或指定端口
uv run python run.py 8888
```

浏览器打开 `http://localhost:8501`，输入研究问题（例：**"本周电子行业有哪些值得关注的动态？"**），点击"生成报告"即可。

## 下一步

- 想看代码怎么组织？读 [代码导览](/development/codebase-map)。
- 想在本地改文档或跑测试？读 [本地开发](/development/local-dev)。
- 想把文档站部署到 GitHub Pages？读 [部署](/development/deployment)。
