# 后端服务

本目录用于放 AI 学习助手的最小后端。

## 当前职责

1. 接收 App 请求。
2. 连接 MySQL。
3. 保存和删除用户的 DeepSeek API Key。
4. 后续由后端代请求 DeepSeek。

## 本地启动

先复制环境变量示例：

```bash
cp server/.env.example server/.env
```

然后在 `server/.env` 中填写本机 MySQL 密码。

启动后端：

```bash
npm run server:dev
```

健康检查：

```text
GET http://localhost:3001/api/health
GET http://localhost:3001/api/db/health
```

配置接口：

```text
POST http://localhost:3001/api/config
GET http://localhost:3001/api/config/:username
DELETE http://localhost:3001/api/config/:username/key
```

聊天接口：

```text
POST http://localhost:3001/api/chat
```

## 安全说明

不要把 `server/.env` 提交到 Git。

不要把数据库密码或 DeepSeek API Key 写进源码、文档或开发日志。
