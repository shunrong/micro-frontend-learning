import React, { useEffect, useState } from "react";
import { Layout, Menu, Spin, message, Switch, Badge, Dropdown } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { registerMicroApps, start, setDefaultMountApp } from "qiankun";
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  HomeOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import {
  actions,
  onGlobalStateChange,
  setGlobalState,
  addNotification,
  toggleTheme,
  type GlobalState,
} from "./store/globalStore";
import "./App.css";

const { Header, Sider, Content } = Layout;

// 微应用配置
const microApps = [
  {
    name: "react-micro-app",
    entry: "//localhost:3001",
    container: "#subapp-viewport",
    activeRule: "/user",
  },
  {
    name: "vue-micro-app",
    entry: "//localhost:3002",
    container: "#subapp-viewport",
    activeRule: "/product",
  },
  {
    name: "angular-micro-app",
    entry: "//localhost:3003",
    container: "#subapp-viewport",
    activeRule: "/order",
  },
];

function MainContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [globalState, setLocalGlobalState] = useState<GlobalState>({
    user: { id: 1, name: "管理员", role: "admin" },
    theme: "light",
    language: "zh-CN",
    notifications: [],
    sharedData: {},
  });

  useEffect(() => {
    // 监听全局状态变化
    const unsubscribe = onGlobalStateChange((state, prevState) => {
      console.log("[主应用] 全局状态变更:", state, prevState);
      setLocalGlobalState(state);

      // 显示通知
      if (
        state.notifications &&
        prevState.notifications &&
        state.notifications.length > prevState.notifications.length
      ) {
        const latestNotification =
          state.notifications[state.notifications.length - 1];
        const messageType = latestNotification.type as keyof typeof message;
        if (messageType && typeof message[messageType] === "function") {
          (message[messageType] as any)(latestNotification.message);
        }
      }
    });

    // 注册微应用
    registerMicroApps(microApps, {
      beforeLoad: (app) => {
        console.log("[qiankun] before load", app.name);
        setLoading(true);
        return Promise.resolve();
      },
      beforeMount: (app) => {
        console.log("[qiankun] before mount", app.name);
        return Promise.resolve();
      },
      afterMount: (app) => {
        console.log("[qiankun] after mount", app.name);
        setLoading(false);
        return Promise.resolve();
      },
      beforeUnmount: (app) => {
        console.log("[qiankun] before unmount", app.name);
        return Promise.resolve();
      },
      afterUnmount: (app) => {
        console.log("[qiankun] after unmount", app.name);
        return Promise.resolve();
      },
    });

    // 启动 qiankun
    start({
      prefetch: false, // 禁用预加载
      sandbox: {
        strictStyleIsolation: true, // 严格的样式隔离
      },
    });

    // 设置默认子应用
    setDefaultMountApp("/user");

    return unsubscribe;
  }, []);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: "/user",
      icon: <UserOutlined />,
      label: <Link to="/user">用户管理</Link>,
    },
    {
      key: "/product",
      icon: <ShoppingOutlined />,
      label: <Link to="/product">商品管理</Link>,
    },
    {
      key: "/order",
      icon: <FileTextOutlined />,
      label: <Link to="/order">订单管理</Link>,
    },
  ];

  const renderMainContent = () => {
    if (location.pathname === "/") {
      return (
        <div style={{ padding: "24px", textAlign: "center" }}>
          <h1>欢迎来到微前端主应用</h1>
          <p>这是一个基于 qiankun 的微前端示例项目</p>
          <div style={{ marginTop: "32px", textAlign: "left" }}>
            <h3>项目架构：</h3>
            <ul>
              <li>
                <strong>主应用</strong>：React + TypeScript +
                qiankun（端口：3000）
              </li>
              <li>
                <strong>用户管理微应用</strong>：React +
                TypeScript（端口：3001）
              </li>
              <li>
                <strong>商品管理微应用</strong>：Vue 3 +
                TypeScript（端口：3002）
              </li>
              <li>
                <strong>订单管理微应用</strong>：Angular +
                TypeScript（端口：3003）
              </li>
            </ul>
            <h3>微前端特性：</h3>
            <ul>
              <li>✅ 技术栈无关：每个微应用可以使用不同的框架</li>
              <li>✅ 独立开发：各个团队可以独立开发自己的微应用</li>
              <li>✅ 独立部署：每个微应用可以独立部署和版本管理</li>
              <li>✅ 样式隔离：避免不同应用之间的样式冲突</li>
              <li>✅ 沙箱隔离：JavaScript 执行环境隔离</li>
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  // 通知菜单
  const notificationMenu = {
    items: globalState.notifications.slice(-5).map((notification) => ({
      key: notification.id,
      label: (
        <div style={{ maxWidth: "200px" }}>
          <div style={{ fontWeight: "bold" }}>
            {notification.type.toUpperCase()}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {new Date(notification.timestamp).toLocaleString()}
          </div>
          <div>{notification.message}</div>
        </div>
      ),
    })),
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: globalState.theme === "dark" ? "#1f1f1f" : "#001529",
        }}
      >
        <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
          微前端管理系统 - 欢迎 {globalState.user.name} ({globalState.user.role}
          )
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={globalState.theme === "dark"}
            onChange={toggleTheme}
          />
          <Dropdown menu={notificationMenu} placement="bottomRight">
            <Badge count={globalState.notifications.length} size="small">
              <BellOutlined
                style={{ color: "white", fontSize: "16px", cursor: "pointer" }}
              />
            </Badge>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 0,
              minHeight: 280,
              position: "relative",
            }}
          >
            <Spin spinning={loading} tip="加载微应用中...">
              {renderMainContent()}
              <div id="subapp-viewport" style={{ minHeight: "400px" }}></div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;
