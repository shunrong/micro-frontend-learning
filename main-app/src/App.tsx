import React, { useEffect, useState } from "react";
import { Layout, Menu, message, Switch, Badge, Dropdown } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
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

// 微应用配置 - 使用 iframe 方式
const microApps = [
  {
    name: "react-micro-app",
    url: "http://localhost:3001",
    path: "/user",
    title: "用户管理",
  },
  {
    name: "vue-micro-app",
    url: "http://localhost:3002",
    path: "/product",
    title: "商品管理",
  },
  {
    name: "angular-micro-app",
    url: "http://localhost:3003",
    path: "/order",
    title: "订单管理",
  },
];

function MainContent() {
  const location = useLocation();
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

    // iframe 通信监听
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin &&
        !event.origin.includes("localhost")
      ) {
        return;
      }

      console.log("[主应用] 收到微应用消息:", event.data);

      if (event.data.type === "MICRO_APP_READY") {
        console.log(`[主应用] ${event.data.appName} 已准备就绪`);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
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
          <p>这是一个基于 iframe + postMessage 的微前端示例项目</p>
          <div style={{ marginTop: "32px", textAlign: "left" }}>
            <h3>项目架构：</h3>
            <ul>
              <li>
                <strong>主应用</strong>：React + TypeScript（端口：3000）
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
              <li>✅ 完全隔离：iframe 天然提供样式和 JS 隔离</li>
              <li>✅ 简单稳定：没有复杂的构建配置和兼容性问题</li>
            </ul>
          </div>
        </div>
      );
    }

    // 渲染微应用 iframe
    const currentApp = microApps.find((app) => app.path === location.pathname);
    if (currentApp) {
      return (
        <iframe
          src={currentApp.url}
          style={{
            width: "100%",
            height: "calc(100vh - 64px - 48px)", // 减去 header 和 padding 高度
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          title={currentApp.title}
          onLoad={(e) => {
            console.log(`[主应用] ${currentApp.name} iframe 加载完成`);
            // 向微应用发送初始化数据
            const iframe = e.target as HTMLIFrameElement;
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage(
                {
                  type: "INIT_DATA",
                  data: globalState,
                },
                currentApp.url
              );
            }
          }}
        />
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
            {renderMainContent()}
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
