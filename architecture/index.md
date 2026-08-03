> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/architecture/index.md.

# 技术栈

| 层        | 选型                       | 说明                         |
| :------- | :----------------------- | :------------------------- |
| 前端       | Streamlit                | 快速 Demo，无需前端开发             |
| Agent 编排 | LangChain / MCP          | 任务拆解、工具调度                  |
| 搜索       | Tavily API / Bing API    | **不使用任何金融数据 API**          |
| 私有知识库    | Chroma + PyPDF           | 向量检索 + PDF 解析              |
| LLM      | GPT-3.5-turbo / DeepSeek | 低成本，DeepSeek 为 OpenAI 1/10 |
| 异步任务     | Celery + Redis（可选）       | 长任务不阻塞界面                   |

## 选型要点

### 前端：Streamlit

Demo 阶段追求快速验证，Streamlit 提供纯 Python 的 Web 界面能力，
无需独立前端开发，适合单人小团队快速迭代。

### Agent 编排：LangChain / MCP

LangChain 用于任务拆解与工具调度，MCP（Model Context Protocol）
用于标准化工具接入，两者结合实现多轮搜索编排。

### 搜索：Tavily / Bing API

**核心原则：不使用任何金融数据 API。** 全部通过通用搜索 API 获取公开信息，
降低合规风险与数据成本。

### 私有知识库：Chroma + PyPDF

Chroma 提供本地向量数据库能力，PyPDF 负责 PDF 文本解析。
两者结合实现用户私有资料的本地 RAG 检索，数据不出本地。

### LLM：GPT-3.5-turbo / DeepSeek

Demo 阶段优先低成本方案：

- GPT-3.5-turbo 作为默认选项，生态成熟
- DeepSeek 作为备选，成本约为 OpenAI 的 1/10

### 异步任务：Celery + Redis（可选）

单次报告生成耗时较长（≤15 分钟），通过 Celery + Redis 实现异步任务队列，
避免长任务阻塞用户界面。Demo 阶段可选。

## 本节页面

| 页面                                                    | 内容                   |
| :---------------------------------------------------- | :------------------- |
| [数据流](/druce-website/architecture/data-flow.md)       | 从用户输入到报告生成的 6 节点核心流程 |
| [数据来源策略](/druce-website/architecture/data-sources.md) | 无金融 API 方案下的 5 类数据来源 |

> 相关数据流程参见 [数据流](/druce-website/architecture/data-flow.md)。
