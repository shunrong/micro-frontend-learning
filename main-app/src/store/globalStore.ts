// 全局状态管理 - 用于微应用间通信
import { initGlobalState } from "qiankun";

// 定义全局状态的接口
export interface GlobalState {
  user: {
    id: number | null;
    name: string;
    role: string;
  };
  theme: "light" | "dark";
  language: "zh-CN" | "en-US";
  notifications: Array<{
    id: string;
    type: "info" | "success" | "warning" | "error";
    message: string;
    timestamp: number;
  }>;
  sharedData: Record<string, any>;
}

// 初始化全局状态
const initialState: GlobalState = {
  user: {
    id: 1,
    name: "管理员",
    role: "admin",
  },
  theme: "light",
  language: "zh-CN",
  notifications: [],
  sharedData: {},
};

// 初始化 qiankun 全局状态
const actions = initGlobalState(initialState);

// 导出状态管理器
export { actions };

// 导出全局状态变更监听器
export const onGlobalStateChange = (
  callback: (state: any, prevState: any) => void
) => {
  return actions.onGlobalStateChange(callback);
};

// 导出设置全局状态的方法
export const setGlobalState = (state: Partial<GlobalState>) => {
  actions.setGlobalState(state);
};

// 工具函数：添加通知
export const addNotification = (
  notification: Omit<GlobalState["notifications"][0], "id" | "timestamp">
) => {
  const newNotification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };

  actions.setGlobalState({
    notifications: [...initialState.notifications, newNotification],
  });
};

// 工具函数：更新用户信息
export const updateUser = (user: Partial<GlobalState["user"]>) => {
  actions.setGlobalState({
    user: { ...initialState.user, ...user },
  });
};

// 工具函数：切换主题
export const toggleTheme = () => {
  const currentTheme = initialState.theme;
  const newTheme = currentTheme === "light" ? "dark" : "light";
  actions.setGlobalState({
    theme: newTheme,
  });
};

// 工具函数：设置共享数据
export const setSharedData = (key: string, value: any) => {
  actions.setGlobalState({
    sharedData: {
      ...initialState.sharedData,
      [key]: value,
    },
  });
};

// 工具函数：获取共享数据
export const getSharedData = (key: string) => {
  return initialState.sharedData[key];
};
