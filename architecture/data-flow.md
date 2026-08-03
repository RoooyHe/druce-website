> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/architecture/data-flow.md.

# 数据流（核心流程）

```text
用户输入问题
    ↓
LLM 拆解为 3-5 个子搜索词
    ↓
并行执行搜索（每词 3-5 条结果）
    ↓
合并搜索结果 + 用户私有数据（如有）
    ↓
LLM 生成带引用的结构化报告
    ↓
前端展示 + 来源追溯
```

## 流程节点说明

### 1. 用户输入问题

用户在前端（Streamlit）输入自然语言研究问题，
例如 "本周电子行业观点" 或 "按巴菲特护城河框架分析自选股"。

### 2. LLM 拆解为子搜索词

LLM 将用户问题自动拆解为 3-5 个可搜索的子关键词，
拆解结果对用户可见，便于人工校验。

### 3. 并行执行搜索

基于拆解出的子关键词，并行执行多轮搜索：

- 每个子词返回 3-5 条结果
- 单次任务覆盖 500-1000 个网页
- 使用 Tavily / Bing 搜索 API

### 4. 合并搜索结果 + 私有数据

将多轮搜索结果去重合并，同时检索用户上传的私有数据（如有），
形成统一的上下文供 LLM 生成报告。

### 5. LLM 生成带引用的结构化报告

LLM 基于合并后的上下文生成结构化报告，
报告包含摘要、分点详述、风险提示、参考资料四部分，
每个数据点带来源 + 链接 + 时间标注。

### 6. 前端展示 + 来源追溯

报告在前端展示，用户可点击引用链接追溯原始来源，
系统对低权威信源标注 "非机构观点"。

> 数据来源策略详见 [数据来源策略](/druce-website/architecture/data-sources.md)。
