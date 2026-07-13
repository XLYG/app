# 后端与存储规范

## 基本结论

Expo App 不直接连接 MySQL，也不直接请求 DeepSeek。

正确链路：

```text
Expo App -> 自己的后端 -> MySQL
Expo App -> 自己的后端 -> DeepSeek API
```

原因：

1. 移动端直连 MySQL 不安全，也不适合发布。
2. 数据库账号和密码不能放在 App 中。
3. DeepSeek API Key 不能长期暴露在前端代码中。
4. 后端可以统一做校验、加密、删除、错误处理和限流。

## MVP 用户配置流程

用户首次使用时需要提交：

1. 用户名。
2. DeepSeek API Key。

后端收到后：

1. 校验用户名是否为空。
2. 校验 DeepSeek API Key 是否为空。
3. 将配置保存到 MySQL。
4. 后续 AI 对话使用该用户保存的 DeepSeek API Key 调用 DeepSeek。
5. 用户可以删除已保存的 DeepSeek API Key。

## MySQL 规则

开发环境优先使用本机 MySQL。

连接信息不得硬编码到源码中，应通过环境变量配置：

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

如果本机 MySQL 不可用，MVP 阶段允许采用本地存储方案作为临时 fallback，但必须记录在开发日志中。

## 建议数据表

MVP 阶段只需要一张用户 API 配置表：

```text
user_api_keys
```

建议字段：

1. `id`: 主键。
2. `username`: 用户名。
3. `provider`: 模型供应商，MVP 固定为 `deepseek`。
4. `api_key_encrypted`: 加密后的 API Key。
5. `created_at`: 创建时间。
6. `updated_at`: 更新时间。
7. `deleted_at`: 删除时间，可为空。

## API 设计草案

MVP 后端接口建议：

```text
GET /api/health
```

检查后端服务是否启动。

```text
GET /api/db/health
```

检查后端是否能连接 MySQL。

```text
POST /api/config
```

保存用户名和 DeepSeek API Key。

```text
GET /api/config/:username
```

查询指定用户是否已保存 DeepSeek API Key。该接口不返回 Key 明文。

```text
DELETE /api/config/:username/key
```

删除指定用户保存的 DeepSeek API Key。

```text
POST /api/chat
```

根据用户名找到 DeepSeek API Key，并向 DeepSeek 发起对话请求。

当前默认模型：

```text
deepseek-v4-flash
```

该值通过 `DEEPSEEK_MODEL` 环境变量配置。

## 安全要求

1. 不在前端保存数据库账号和密码。
2. 不在前端代码中写死 DeepSeek API Key。
3. 不在日志中打印完整 API Key。
4. MySQL 中不明文保存 API Key，至少要为后续加密预留字段。
5. 删除 Key 后，后续聊天必须提示用户重新配置。

## 当前后端文件

后端代码放在：

```text
server/
```

当前文件：

1. `server/index.js`: Express 服务入口。
2. `server/db.js`: MySQL 连接池。
3. `server/crypto.js`: API Key 加密和解密工具。
4. `server/schema.sql`: MVP 数据库和表结构。
5. `server/.env.example`: 环境变量示例，不包含真实密码或 Key。

当前端口：

```text
http://localhost:3001
```
