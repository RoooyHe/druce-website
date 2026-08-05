> For AI agents: the complete documentation index is available at /druce-website/llms.txt, the full documentation bundle is available at /druce-website/llms-full.txt, and this page is available as Markdown at /druce-website/development/prd-v2-roadmap.md.

# PRD v2 AlphaAgent 落地路线图

> 本文档沉淀自 2026-08-05 grilling session(5 轮 14 拍板点)。
> 架构决策详见 ADR-0004(仓库根 `docs/adr/0004-prd-v2-alphaagent-architecture.md`),
> 领域术语详见仓库根 `CONTEXT.md`。

## 1. 定位:PRD v2 与当前 Druce 的关系

PRD v2 标题为「AlphaAgent — 多视角 AI 金融投研助手」,描述的是一个**与当前 Druce 不同的产品形态**。

grilling 第 1 轮拍板:**两者关系为「叠加 (B)」**——

| 维度       | 当前 Druce(路径 1)          | PRD v2 AlphaAgent(路径 2)                        |
| -------- | ----------------------- | ---------------------------------------------- |
| 数据基底     | Tavily/Bing 搜索 + 巨潮资讯抓取 | AKShare(Python 财务数据接口)+ 巨潮资讯 PDF 解析            |
| Agent 架构 | 单 LLM 拼四段报告             | 多 Agent(价值/成长/风控)并行推演 + Debate 汇总 + Auditor 核查 |
| 输出形态     | 四段(摘要/分点/风险/参考)         | 五章(摘要矩阵/确定性指标/框架推演/事实核查/情景推演)                  |

**两路并存,用户可选「广域搜集报告」(路径 1)或「AlphaAgent 研报」(路径 2)。**

## 2. 差距分析:PRD v2 四模块 vs 当前实现

PRD v2 的 4 个新模块在当前 Druce 代码里**完全没有任何前身可演进**(grilling 1.2 拍板),均为绿地新建。

### 2.1 模块一:数据采集与确定性计算引擎 (Data Engine)

**PRD v2 要求**:

- 数据源:AKShare(行情/财务报表)+ 巨潮资讯(公告/财报 PDF)+ Tavily/Serper(新闻/舆情)
- 自动提取近 3\~5 年三大财务报表
- Python 侧确定性计算 ROE、毛利率、净利率、资产负债率、PEG、应收账款周转天数等
- 规则预警打标 `[Anomaly_Tag]`

**当前实现差距**:

| 差距项        | 当前状态                           | 差距性质        |
| ---------- | ------------------------------ | ----------- |
| AKShare 接入 | 无                              | 绿地新建        |
| 三大报表字段化提取  | 无                              | 绿地新建        |
| 确定性财务比率计算  | 无                              | 绿地新建        |
| 异常规则打标     | 无                              | 绿地新建        |
| 新闻/舆情数据源   | `app/search.py` 已有 Tavily/Bing | **复用,无需新建** |

**关键决策(grilling 2.1 拍板 b)**:路径 2 的新闻/舆情**复用路径 1 的 `search.py`**,AKShare 只管财报/行情,避免双搜索栈和 fallback 幻觉。

### 2.2 模块二:多视角投资框架 Agent (3 个推演 Agent)

**PRD v2 要求**:

- 价值派 Agent(巴菲特/芒格):护城河、ROE 稳定性、FCF、债务风险
- 成长派 Agent(彼得·林奇 GARP):营收/净利增速、PEG、存货匹配度
- 风控派 Agent:财报隐患、非经常性损益占比、现金流断裂隐患
- 每个 Agent 有「核心指标与定量阈值表」+「代码/Prompt 硬性判定规则」

**当前实现差距**:

| 差距项           | 当前状态 | 差距性质 |
| ------------- | ---- | ---- |
| 价值派 Agent     | 无    | 绿地新建 |
| 成长派 Agent     | 无    | 绿地新建 |
| 风控派 Agent     | 无    | 绿地新建 |
| 阈值表 prompt 结构 | 无    | 绿地新建 |

**关键决策(grilling 2.2 拍板)**:门槛逻辑**写 prompt**(时间有限,没法调算法)。已知风险:LLM 可能把 14.8% 判成 pass(差不多),幻觉风险回来。兜底项:最终交付前把关键门槛从 prompt 抽到 Python 确定性判断。

**关键决策(grilling 3.1 拍板 b)**:3 个推演 Agent **串行**调用 LLM(非并行)。已知风险:串行延迟可能把单次研报从 1-3 分钟推到 8-15 分钟,顶 AC-05 的 15 分钟上限。

**关键决策(grilling 3.2 拍板 e)**:推演 Agent 用 **DeepSeek**(便宜),Debate 用 **GPT-4o**(强)。`app/llm.py` 需改成多 provider 路由。

### 2.3 模块三:分歧辩论与综合研判 Agent (Debate Agent)

**PRD v2 要求**:

- 汇总 3 个推演 Agent 评估结果
- 生成多视角对比矩阵(Dashboard 表格)
- 提取共识点、梳理核心争议点
- 给出分人群操作建议

**当前实现差距**:

| 差距项     | 当前状态 | 差距性质 |
| ------- | ---- | ---- |
| 多视角汇总逻辑 | 无    | 绿地新建 |
| 共识/分歧提取 | 无    | 绿地新建 |
| 分人群操作建议 | 无    | 绿地新建 |

### 2.4 模块四:反思核查与数据可追溯模块 (Auditor Agent)

**PRD v2 要求**:

- 溯源标注:对报告中每一个具体财务数据,自动附带出处索引
- 文本 vs Data Engine 数据二次比对
- 若发现数字不符或无中生有,打回重写

**当前实现差距**:

| 差距项                    | 当前状态 | 差距性质 |
| ---------------------- | ---- | ---- |
| 财报数据溯源标注               | 无    | 绿地新建 |
| 报告数字 vs AKShare 原始数据比对 | 无    | 绿地新建 |
| 不符则打回重写的回环             | 无    | 绿地新建 |

**关键决策(grilling 2.3 拍板 ii)**:路径 2 的 Auditor Agent 与路径 1 的 `cross_validate` **互不干涉**。路径 2 Auditor 只管"研究报告里的数字 vs AKShare 原始数据比对",路径 1 cross\_validate 只管"信源数量/权威/冲突"。

## 3. 架构决策汇总

### 3.1 代码组织(grilling 4.1 拍板 a)

```
app/
├── agents/                    # 新建:多 Agent 推演
│   ├── value_agent.py         # 价值派(巴菲特/芒格)
│   ├── growth_agent.py        # 成长派(彼得·林奇 GARP)
│   ├── risk_agent.py          # 风控派
│   ├── debate_agent.py        # 分歧辩论与综合研判
│   └── auditor_agent.py       # 反思核查与数据可追溯
├── dataengine/                # 新建:AKShare + 确定性计算
│   ├── akshare_client.py      # AKShare 接入
│   ├── financial_statements.py # 三大报表字段化提取
│   ├── ratios.py              # 确定性财务比率计算
│   └── anomaly_tags.py        # 异常规则打标
├── search.py                  # 留顶层不动(避免连锁 import 改动)
├── pipeline.py                # 路径 1 编排(现有)
├── pipeline_v2.py             # 新建:路径 2 编排
├── llm.py                     # 改造:单 provider → 多 provider 路由
├── report.py                  # 路径 1 报告生成(现有)
├── streamlit_app.py           # 入口,加路由:用户选路径 1 或路径 2
└── ... (其他现有文件不动)
```

### 3.2 LLM 多 provider 路由(grilling 3.2 拍板 e)

| Agent 角色        | LLM      | 理由                  |
| --------------- | -------- | ------------------- |
| 价值派 / 成长派 / 风控派 | DeepSeek | 便宜,推演逻辑可由 prompt 引导 |
| Debate Agent    | GPT-4o   | 强,做汇总裁决质量更高         |
| Auditor Agent   | DeepSeek | 便宜,做数字比对逻辑性强        |

### 3.3 AKShare 数据缓存(grilling 4.3 拍板 i)

- 拉到的财报数据存 `data/{company}_{report_period}.json`
- 财报缓存 TTL 7 天(财报一年 4 次更新)
- 行情缓存 TTL 1 天
- 轻量,Druce 单用户无并发问题,`data/` 目录 git-ignorable

### 3.4 落地顺序 — 拓扑序(grilling 5.2 拍板 e)

```
Data Engine (AKShare + 确定性计算)
        ↓
[Value ‖ Growth ‖ Risk]  3 个推演 Agent
        ↓
Debate Agent (汇总)
        ↓
Auditor Agent (核查)
```

## 4. Roadmap:分阶段落地

### Milestone 0:基础设施改造(前置)

| 任务                         | 说明                                   | 依赖 |
| -------------------------- | ------------------------------------ | -- |
| `app/llm.py` 多 provider 路由 | 支持 DeepSeek + GPT-4o 切换,按 Agent 角色路由 | 无  |
| 新建 `app/agents/` 目录结构      | 空目录 + `__init__.py`                  | 无  |
| 新建 `app/dataengine/` 目录结构  | 空目录 + `__init__.py`                  | 无  |
| 新建 `app/pipeline_v2.py` 骨架 | 空函数 + emit 进度回调                      | 无  |
| `data/` 目录 + `.gitignore`  | AKShare 缓存目录,git-ignorable           | 无  |

### Milestone 1:Data Engine(AKShare + 确定性计算)

| 任务                        | 说明                                                          | 依赖                       |
| ------------------------- | ----------------------------------------------------------- | ------------------------ |
| `akshare_client.py`       | AKShare 接入,封装行情/财务报表拉取                                      | M0                       |
| `financial_statements.py` | 三大报表(资产负债表/利润表/现金流量表)字段化提取,近 3\~5 年                         | M1.akshare\_client       |
| `ratios.py`               | 确定性计算 ROE、毛利率、净利率、资产负债率、PEG、应收账款周转天数、经营性现金流/净利润比值           | M1.financial\_statements |
| `anomaly_tags.py`         | 异常规则打标:应收账款增速 > 营收增速 + 15% 等,自动打 `[Anomaly_Tag]`            | M1.ratios                |
| 文件缓存                      | `data/{company}_{report_period}.json`,财报 TTL 7 天,行情 TTL 1 天 | M1.akshare\_client       |

**验收标准(Milestone 1)**:

- 输入股票代码,能拉到近 3\~5 年三大报表
- 确定性计算出 PRD v2 第三章所有 Agent 需要的比率
- 异常规则触发时正确打标
- 重复请求同一公司同一报告期命中缓存

### Milestone 2:3 个推演 Agent

| 任务                 | 说明                                           | 依赖                   |
| ------------------ | -------------------------------------------- | -------------------- |
| `value_agent.py`   | 价值派 Agent:护城河、ROE 稳定性、FCF、债务风险,门槛逻辑写 prompt  | M1                   |
| `growth_agent.py`  | 成长派 Agent:营收/净利增速、PEG、存货匹配度,门槛逻辑写 prompt     | M1                   |
| `risk_agent.py`    | 风控派 Agent:财报隐患、非经常性损益占比、现金流断裂隐患,门槛逻辑写 prompt | M1                   |
| 推演 Agent prompt 模板 | 每个 Agent 的阈值表 + 硬性判定规则 prompt 结构             | M2.value/growth/risk |

**验收标准(Milestone 2)**:

- 输入确定性计算结果,3 个 Agent 各自输出【看多/观望/看空】(或【低/中/高风险】)+ 逻辑叙述
- 串行调用,延迟可接受(暂不卡 AC-05)
- 3 个 Agent 用 DeepSeek

### Milestone 3:Debate Agent(汇总)

| 任务                | 说明                                             | 依赖               |
| ----------------- | ---------------------------------------------- | ---------------- |
| `debate_agent.py` | 汇总 3 个推演 Agent 结果,生成多视角对比矩阵,提取共识/分歧,给出分人群操作建议  | M2               |
| Debate prompt 模板  | 输入 3 个推演输出,输出第一章「摘要与多视角判定矩阵」+ 第五章「情景推演与投资策略建议」 | M3.debate\_agent |

**验收标准(Milestone 3)**:

- 输入 3 个推演 Agent 输出,Debate 生成多视角对比矩阵 + 共识/分歧 + 分人群操作建议
- Debate 用 GPT-4o
- 延迟可接受

### Milestone 4:Auditor Agent(核查)

| 任务                 | 说明                                                          | 依赖                |
| ------------------ | ----------------------------------------------------------- | ----------------- |
| `auditor_agent.py` | 溯源标注:对报告中每一个具体财务数据自动附带出处索引;文本 vs Data Engine 数据二次比对;不符则打回重写 | M1 + M3           |
| Auditor prompt 模板  | 输入 Debate 报告 + AKShare 原始数据,输出第四章「数据可追溯性与事实核查」              | M4.auditor\_agent |

**验收标准(Milestone 4)**:

- 输入 Debate 报告 + AKShare 原始数据,Auditor 输出溯源表 + 修正记录
- 报告里的数字与 AKShare 原始数据不符时,标记并打回
- Auditor 用 DeepSeek

### Milestone 5:pipeline\_v2 串联 + Streamlit 路由

| 任务                    | 说明                                                    | 依赖              |
| --------------------- | ----------------------------------------------------- | --------------- |
| `pipeline_v2.py` 串联   | Data Engine → 3 推演 Agent → Debate → Auditor,emit 进度回调 | M1-M4           |
| `streamlit_app.py` 路由 | 用户选「广域搜集报告」(路径 1)或「AlphaAgent 研报」(路径 2)               | M5.pipeline\_v2 |
| 五章输出渲染                | 将路径 2 的结构化输出渲染为 PRD v2 第五章规范                          | M5.pipeline\_v2 |

**验收标准(Milestone 5)**:

- Streamlit 用户可选路径 1 或路径 2
- 路径 2 端到端跑通,输出五章 Markdown 研报
- 路径 1(广域搜集报告)不受影响,继续可用

### Milestone 6:已知风险兜底(最终交付前)

| 任务                           | 说明                                                        | 依赖 |
| ---------------------------- | --------------------------------------------------------- | -- |
| 关键门槛从 prompt 抽到 Python 确定性判断 | grilling 2.2 已知风险兜底:LLM 可能把 14.8% 判成 pass,关键门槛最终抽到 Python | M2 |
| 串行延迟监控                       | grilling 3.1 已知风险兜底:若串行延迟顶到 AC-05 的 15 分钟,后续异步化或并行化       | M5 |

## 5. 与现有 ADR 的关系

| ADR                               | 状态              | 与 PRD v2 的关系                                   |
| --------------------------------- | --------------- | ---------------------------------------------- |
| ADR-0001 单用户为主                    | 待重新评估           | PRD v2 不改这个判定,路径 2 仍单用户                        |
| ADR-0002 Celery+Redis             | deprecated      | PRD v2 的串行拓扑不依赖异步队列,ADR-0002 的 deprecated 判定不变 |
| ADR-0003 持续对话 Agent               | active → **暂停** | PRD v2 优先,ADR-0003 暂停(grilling 5.1 拍板)         |
| **ADR-0004 PRD v2 AlphaAgent 架构** | **active**      | 本 roadmap 的架构决策来源                              |

## 6. 暂停项:ADR-0003 持续对话 Agent

grilling 5.1 拍板:**PRD v2 优先,ADR-0003 暂停**。

理由:

- PRD v2 是产品经理提出的新版需求,优先级高于内部演进
- PRD v2 的多 Agent 研报落地后,反过来会重塑 ADR-0003 的对话记忆颗粒度——对话要引用"价值派的护城河评分",而不是引用现有 DataPoint
- 先把 PRD v2 跑通,ADR-0003 等尘埃落定再续

## 7. 验收标准(PRD v2 整体)

| 编号       | 验收项           | 标准                                                       | 对应 Milestone |
| -------- | ------------- | -------------------------------------------------------- | ------------ |
| AC-V2-01 | AKShare 接入    | 输入股票代码,能拉到近 3\~5 年三大报表 + 行情                              | M1           |
| AC-V2-02 | 确定性计算         | Python 侧计算出 PRD v2 第三章所有 Agent 需要的比率                     | M1           |
| AC-V2-03 | 异常打标          | 触发异常规则时正确打 `[Anomaly_Tag]`                               | M1           |
| AC-V2-04 | 价值派 Agent     | 输入确定性计算结果,输出【看多/观望/看空】+ 护城河逻辑 + 最关心风险                    | M2           |
| AC-V2-05 | 成长派 Agent     | 输入确定性计算结果,输出【看多/观望/看空】+ 成长匹配度逻辑 + 拓展潜力                   | M2           |
| AC-V2-06 | 风控派 Agent     | 输入确定性计算结果,输出【低/中/高风险】+ 核心财务隐患清单                          | M2           |
| AC-V2-07 | Debate Agent  | 输入 3 个推演输出,生成多视角对比矩阵 + 共识/分歧 + 分人群操作建议                   | M3           |
| AC-V2-08 | Auditor Agent | 输入 Debate 报告 + AKShare 原始数据,输出溯源表 + 修正记录,数字不符则打回         | M4           |
| AC-V2-09 | 五章输出          | 路径 2 输出严格遵循 PRD v2 第五章规范(五章 Markdown 研报)                 | M5           |
| AC-V2-10 | 双路共存          | Streamlit 用户可选路径 1(广域搜集报告)或路径 2(AlphaAgent 研报),路径 1 不受影响 | M5           |
| AC-V2-11 | 延迟可控          | 单次研报 ≤ 15 分钟(AC-05),串行拓扑下监控延迟                            | M5 + M6      |
