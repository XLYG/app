# 项目文档索引

本目录记录 AI 学习助手 App 的开发需求、技术约定、设计规范和执行步骤。

## 文档列表

- `PROJECT_REQUIREMENTS.md`: 项目目标、MVP 范围、暂不做事项。
- `TECHNICAL_STANDARD.md`: 技术选型、目录约定、接口与安全规则。
- `BACKEND_STORAGE_STANDARD.md`: 后端、MySQL、DeepSeek Key 存储与删除规则。
- `MOBILE_TESTING.md`: 手机真机调试和局域网 API 配置说明。
- `DESIGN_STANDARD.md`: 页面设计、交互状态、文案和可用性规范。
- `DEVELOPMENT_PLAN.md`: 分阶段开发步骤，每次只推进一个小目标。
- `EXECUTION_STANDARD.md`: 每次开发前后必须遵守的工作流程。

## 当前开发原则

1. 先跑通最小闭环，再逐步增加功能。
2. 不做登录注册、不做复杂权限、不做过度封装。
3. 前端只请求自己的后端，AI 服务请求由后端代发。
4. 每次开发都要更新 `dev-daily/` 中当天日志。
5. DeepSeek API Key 和数据库密码不得写入源码、文档或日志。
