import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

function AppWithCommunication() {
  useEffect(() => {
    // 向主应用发送就绪消息
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "MICRO_APP_READY",
          appName: "react-micro-app",
        },
        "*"
      );
    }

    // 监听主应用消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "INIT_DATA") {
        console.log("[React微应用] 收到主应用初始化数据:", event.data.data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return <App />;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppWithCommunication />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
