# 技术规范

## 技术栈

- React Native
- Expo
- Expo Router
- TypeScript
- 后端服务
- MySQL
- DeepSeek API

当前项目使用 Expo SDK 57。写功能代码前必须参考与当前版本匹配的 Expo 文档。

## 目录约定

推荐业务源码集中放在 `src/` 下：

```text
src/
├─ app/          页面与路由
├─ components/   可复用 UI 组件
├─ hooks/        页面逻辑和状态逻辑
├─ services/     请求后端接口
├─ storage/      本地存储读写
├─ types/        TypeScript 类型
├─ constants/    常量、主题、配置
└─ utils/        通用工具函数
```

## 文件职责

1. `src/app/` 只放页面入口和路由布局。
2. `src/components/` 只放 UI 组件，不直接写复杂请求逻辑。
3. `src/hooks/` 管理状态和业务流程，比如发送消息、读取配置。
4. `src/services/` 只负责和后端通信。
5. `src/storage/` 只负责本地数据保存和读取。
6. `src/types/` 只放类型定义，避免类型散落在各个文件。
7. `src/utils/` 放无状态的小工具函数。

## API 规则

1. 前端只请求自己的后端。
2. 不在前端直接请求 AI 模型供应商，包括 DeepSeek。
3. 不在代码中硬编码真实 API Key。
4. 请求失败时必须返回用户能理解的错误提示。
5. 所有网络请求都要处理加载中、成功、失败三种状态。
6. 前端不直接连接 MySQL。
7. 用户名和 DeepSeek API Key 由后端接收并保存。

## 安全规则

1. 不把真实密钥提交进 Git。
2. 日志里不打印 API Key、Token、完整鉴权头。
3. 数据库密码不写入源码、文档或日志。
4. 初学阶段如果 MySQL 不可用，可以临时 fallback 到本地存储，但要明确这不是高安全方案。
5. 真正上线前，敏感密钥应该在后端加密保存。
6. 用户删除 Key 后，后端不得继续使用旧 Key 发起请求。

## TypeScript 规则

1. 新增业务数据结构时，优先在 `src/types/` 定义类型。
2. 尽量避免使用 `any`。
3. 函数入参和接口返回值要有清晰类型。
4. 类型定义保持简单，不为未来功能提前设计复杂泛型。

## 验证规则

每次功能改动后至少执行：

1. TypeScript 或 lint 检查。
2. Expo 启动验证。
3. 关键页面手动点击验证。

如果暂时无法执行某项验证，必须记录在当天开发日志中。
