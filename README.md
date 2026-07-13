# AI 学习助手 App

这是一个基于 React Native + Expo 的 AI 学习助手 MVP。

当前流程：

1. 用户进入 App 后先输入用户名。
2. App 请求后端检查该用户名是否已保存 DeepSeek API Key。
3. 如果已保存，进入聊天页。
4. 如果未保存，跳转配置页保存用户名和 DeepSeek API Key。
5. 后端将 Key 加密后存入 MySQL。
6. 聊天时 App 请求后端，后端代请求 DeepSeek。

## 技术栈

- Expo
- React Native
- Expo Router
- TypeScript
- Express
- MySQL
- DeepSeek API

## 本地开发

安装依赖：

```bash
npm install
```

启动后端：

```bash
npm run server:dev
```

启动 App：

```bash
npm start
```

Web 调试：

```bash
npm run web
```

## 环境变量

前端环境变量示例见：

```text
.env.example
```

后端环境变量示例见：

```text
server/.env.example
```

真实环境变量文件不要提交到 Git。

## 常用地址

```text
App Web: http://localhost:8081
API: http://localhost:3001
API Health: http://localhost:3001/api/health
DB Health: http://localhost:3001/api/db/health
```

## 文档

项目规范和开发计划见：

```text
docs/
```

手机真机测试见：

```text
docs/MOBILE_TESTING.md
```

每日开发记录见：

```text
dev-daily/
```
