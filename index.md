> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/index.md.

# AI 投研助手

Druce

> 花五分钟得到别人花五小时手动搜索才能凑齐的行业情报

[产品概览](/overview/) | [核心功能](/features/) | [快速开始](/development/getting-started)

## Features

- 🔍 **问题拆解**: 将用户问题自动拆为 3-5 个子搜索词，拆解过程对用户可见，便于人工校验和手动调整。
- 🌐 **多轮联网搜索**: 并行执行多轮搜索，单次任务覆盖 500-1000 个网页，使用 Tavily / Bing 搜索 API，不使用任何金融数据 API。
- ✓ **交叉验证**: 同一观点至少 2 个独立信源相互印证，信源冲突时并列展示，低权威信源标注「非机构观点」。
- 🔗 **引用标注**: 每个数据点标注来源、原文链接、发布时间，末尾附完整参考资料清单，无遗漏。
- 📄 **报告生成**: 结构化输出（摘要 → 分点详述 → 风险提示 → 参考资料），单次报告响应时间 ≤ 15 分钟。
- 📁 **私有数据上传**: 支持上传 PDF / Word 格式的内部资料，通过 Chroma 向量数据库实现本地 RAG 检索，数据不出本地。
