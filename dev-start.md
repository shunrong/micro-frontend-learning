# 开发环境启动指南

## 手动启动（推荐）

在不同的终端窗口中分别运行以下命令：

### 终端 1 - 主应用
```bash
cd main-app
npm start
```

### 终端 2 - React 微应用
```bash
cd react-micro-app
npm start
```

### 终端 3 - Vue 微应用
```bash
cd vue-micro-app
npm run dev
```

### 终端 4 - Angular 微应用
```bash
cd angular-micro-app
npm start
```

## 访问地址

- 主应用: http://localhost:3000
- React 微应用: http://localhost:3001
- Vue 微应用: http://localhost:3002
- Angular 微应用: http://localhost:3003

## 开发建议

1. 按照上述顺序启动，先启动微应用，最后启动主应用
2. 等待每个应用完全启动后再启动下一个
3. 如果某个端口被占用，可以使用 `lsof -ti:端口号 | xargs kill -9` 来释放端口

## 故障排除

如果应用启动失败，请检查：
1. Node.js 版本是否兼容
2. 依赖是否正确安装 (`npm install`)
3. 端口是否被其他进程占用
4. 防火墙或代理设置
