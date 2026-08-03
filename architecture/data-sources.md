> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/architecture/data-sources.md.

# 数据来源策略（无金融 API 方案）

| 类型      | 来源              | 获取方式          |
| :------ | :-------------- | :------------ |
| 公开研报    | 东方财富研报中心、雪球、格隆汇 | 搜索引擎爬取        |
| 公告 / 财报 | 巨潮资讯网           | 搜索引擎 + PDF 解析 |
| 新闻资讯    | 新浪财经、华尔街见闻      | 搜索引擎          |
| 私有数据    | 用户上传 PDF / Word | 本地 RAG 向量检索   |
| 社区情绪    | 雪球、东财股吧         | 搜索引擎限定站点      |

## 策略要点

### 公开研报

通过搜索引擎爬取东方财富研报中心、雪球、格隆汇等公开研报来源，
不依赖任何金融数据 API。

### 公告 / 财报

通过搜索引擎 + PDF 解析获取巨潮资讯网的公告与财报数据，
PyPDF 负责公告 PDF 的文本解析。

### 新闻资讯

通过搜索引擎获取新浪财经、华尔街见闻等财经媒体的新闻资讯，
覆盖行业动态、公司新闻、政策解读等。

### 私有数据

用户上传 PDF / Word 格式的内部资料，
通过 Chroma 向量数据库实现本地 RAG 检索，数据不出本地。

### 社区情绪

通过搜索引擎限定站点（site:）的方式，
聚合雪球、东财股吧等社区的情绪数据，辅助判断市场情绪。

> 风险与应对策略详见 [原始 PRD](/druce-website/初步报告生成PRD.md) 第九节。
