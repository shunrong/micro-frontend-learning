import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./public-path";

function render(props?: any) {
  const { container } = props || {};
  const root = ReactDOM.createRoot(
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  return root;
}

// 独立运行时，直接启动应用
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

// 导出 qiankun 生命周期函数
export async function bootstrap() {
  console.log("[react微应用] bootstrap");
}

export async function mount(props: any) {
  console.log("[react微应用] mount", props);
  render(props);
}

export async function unmount(props: any) {
  console.log("[react微应用] unmount", props);
  // 这里可以做一些清理工作
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
