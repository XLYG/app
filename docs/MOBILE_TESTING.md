# 手机真机测试说明

## 推荐方式：同一 Wi-Fi 下使用 Expo Go

1. 手机安装 Expo Go。
2. 电脑和手机连接同一个 Wi-Fi。
3. 在电脑上查看局域网 IP。

Windows PowerShell：

```powershell
ipconfig
```

找到当前 Wi-Fi 的 IPv4 地址，例如：

```text
192.168.1.23
```

4. 创建本地前端环境变量文件。

```text
.env.local
```

内容示例：

```text
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.23:3001
```

5. 启动后端。

```bash
npm run server:dev
```

6. 启动 Expo。

```bash
npm start -- --host lan
```

7. 用 Expo Go 扫描终端中的二维码。

## 注意事项

1. 手机里不能使用 `http://localhost:3001` 访问电脑后端。
2. 手机上的 `localhost` 指的是手机自己，不是电脑。
3. Windows 防火墙需要允许 Node.js 或端口 `3001` 被局域网访问。
4. 如果 LAN 模式不通，可以尝试：

```bash
npm start -- --tunnel
```

但即使使用 tunnel，后端 API 仍然需要手机能访问，例如使用电脑局域网 IP 或单独的后端公网/内网穿透地址。

## 之后更正式的方式

开发阶段先用 Expo Go。

如果后续加入 Expo Go 不支持的原生能力，再切换到 Development Build。
