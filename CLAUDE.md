@AGENTS.md

# AI 学习助手 App 工作说明

本项目是一个 React Native + Expo AI 学习助手 App。当前阶段优先跑通最小闭环：用户配置后端 API，输入问题，App 请求后端，后端返回 AI 回复。

## 必读文档路径

开发前先阅读以下文档：

1. `docs/README.md`：项目文档索引。
2. `docs/PROJECT_REQUIREMENTS.md`：项目目标、MVP 范围和暂不开发事项。
3. `docs/TECHNICAL_STANDARD.md`：技术选型、目录职责、API 和安全规则。
4. `docs/DESIGN_STANDARD.md`：页面、交互、文案和可用性规范。
5. `docs/DEVELOPMENT_PLAN.md`：分阶段开发计划。
6. `docs/EXECUTION_STANDARD.md`：每次开发前后的执行标准。

## 每日开发记录

每日开发记录放在：

```text
dev-daily/YYYY-MM-DD.md
```

每次进行开发、重构、验证或文档调整后，都要自动更新当天日志，至少包含：

1. 已完成事项。
2. 待办事项。
3. 验证记录。
4. 风险与备注。

如果当天日志不存在，先创建后再继续开发。

## 工作方式

1. 不一次性生成大量功能代码。
2. 每次只推进 `docs/DEVELOPMENT_PLAN.md` 中的一个小步骤。
3. 功能代码变更前，先确认当前步骤的目标和完成标准。
4. 保持项目简单，优先适合新手理解。
5. 不开发登录、注册、支付、复杂用户系统等非 MVP 功能。
6. 前端只请求自己的后端，不直接请求 AI 模型供应商。
7. 不把真实 API Key、Token 或敏感配置写入源码、文档或日志。
