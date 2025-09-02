# 微前端学习项目

这是一个基于 qiankun 的微前端实战项目，用于学习和理解微前端技术。

## 项目架构

```
micro-frontend-learning/
├── main-app/          # 主应用 (React + TypeScript + qiankun)
├── react-micro-app/   # React 微应用 - 用户管理
├── vue-micro-app/     # Vue 3 微应用 - 商品管理  
├── angular-micro-app/ # Angular 微应用 - 订单管理
└── README.md         # 项目说明
```

## 技术栈

### 主应用 (端口: 3000)
- **框架**: React 18 + TypeScript
- **微前端**: qiankun 2.x
- **UI**: Ant Design
- **路由**: React Router
- **状态管理**: qiankun 全局状态

### React 微应用 (端口: 3001)
- **框架**: React 18 + TypeScript
- **UI**: Ant Design
- **路由**: React Router
- **功能**: 用户管理 (增删改查)

### Vue 微应用 (端口: 3002)
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI**: Ant Design Vue
- **路由**: Vue Router
- **功能**: 商品管理 (增删改查)

### Angular 微应用 (端口: 3003)
- **框架**: Angular 19 + TypeScript
- **UI**: ng-zorro-antd
- **路由**: Angular Router
- **功能**: 订单管理 (增删改查)

## 微前端特性演示

### ✅ 技术栈无关
- 每个微应用使用不同的前端框架 (React/Vue/Angular)
- 各应用可以独立选择技术栈和版本

### ✅ 独立开发部署
- 每个微应用都有独立的代码仓库结构
- 可以独立运行、开发和部署
- 独立的依赖管理和构建流程

### ✅ 样式隔离
- 使用 qiankun 的 strictStyleIsolation 严格样式隔离
- 避免不同应用间的样式冲突

### ✅ JavaScript 沙箱
- 每个微应用运行在独立的 JavaScript 沙箱中
- 避免全局变量污染和冲突

### ✅ 应用间通信
- 基于 qiankun 的全局状态管理
- 支持用户信息、通知、主题等共享状态
- 实时状态同步和事件通信

## 快速开始

### 安装依赖

```bash
# 主应用
cd main-app
npm install

# React 微应用
cd ../react-micro-app
npm install

# Vue 微应用
cd ../vue-micro-app
npm install

# Angular 微应用
cd ../angular-micro-app
npm install
```

### 启动应用

**方式一：手动启动 (推荐用于开发调试)**

```bash
# 终端 1: 启动主应用
cd main-app
npm start

# 终端 2: 启动 React 微应用
cd react-micro-app
npm start

# 终端 3: 启动 Vue 微应用
cd vue-micro-app
npm run dev

# 终端 4: 启动 Angular 微应用
cd angular-micro-app
npm start
```

**方式二：使用启动脚本**

```bash
# 在项目根目录执行
./start-all.sh
```

### 访问应用

- **主应用**: http://localhost:3000
- **React 微应用**: http://localhost:3001 (可独立访问)
- **Vue 微应用**: http://localhost:3002 (可独立访问)
- **Angular 微应用**: http://localhost:3003 (可独立访问)

## 功能特色

### 主应用功能
- 🏠 **首页**: 项目架构介绍和微前端特性说明
- 🎨 **主题切换**: 支持亮色/暗色主题切换
- 🔔 **通知系统**: 跨应用通知管理
- 👤 **用户信息**: 全局用户状态显示
- 🔄 **状态同步**: 实时同步各微应用状态

### React 微应用 - 用户管理
- 👥 用户列表展示
- ➕ 添加新用户
- ✏️ 编辑用户信息
- 🗑️ 删除用户
- 🔍 用户状态管理

### Vue 微应用 - 商品管理
- 🛍️ 商品列表展示
- ➕ 添加新商品
- ✏️ 编辑商品信息
- 🗑️ 删除商品
- 💰 价格和库存管理
- 📦 商品分类管理

### Angular 微应用 - 订单管理
- 📋 订单列表展示
- ➕ 创建新订单
- ✏️ 编辑订单信息
- 🗑️ 删除订单
- 📊 订单状态跟踪
- 💵 订单金额计算

## 学习要点

### 1. 微应用接入
了解如何将现有应用改造为 qiankun 微应用：
- 生命周期函数 (bootstrap, mount, unmount)
- webpack 配置调整
- 路由基座配置

### 2. 样式隔离
理解微前端样式隔离的重要性：
- CSS 作用域隔离
- 主题统一管理
- 样式冲突避免

### 3. 状态管理
掌握微应用间状态共享：
- 全局状态设计
- 状态变更监听
- 跨应用通信

### 4. 路由管理
理解微前端路由机制：
- 主应用路由配置
- 微应用路由集成
- 浏览器历史管理

### 5. 构建部署
了解微前端项目的构建和部署：
- 独立构建流程
- 资源路径处理
- 跨域配置

## 开发建议

1. **渐进式改造**: 可以从单体应用逐步拆分为微前端
2. **合理拆分**: 按业务领域和团队边界拆分微应用
3. **统一规范**: 制定代码规范、UI 规范和接口规范
4. **性能优化**: 注意资源加载和应用切换性能
5. **错误处理**: 完善错误边界和降级方案

## 故障排除

### 常见问题

1. **微应用无法加载**
   - 检查端口是否正确启动
   - 确认 CORS 配置正确
   - 查看浏览器控制台错误信息

2. **样式异常**
   - 确认样式隔离配置
   - 检查 CSS 作用域冲突
   - 验证主题配置

3. **路由问题**
   - 检查 activeRule 配置
   - 确认 base 路径设置
   - 验证 history 模式配置

4. **状态同步异常**
   - 确认全局状态初始化
   - 检查状态监听器
   - 验证状态更新逻辑

## 扩展学习

- [qiankun 官方文档](https://qiankun.umijs.org/)
- [微前端架构设计](https://micro-frontends.org/)
- [single-spa 框架](https://single-spa.js.org/)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个学习项目！
