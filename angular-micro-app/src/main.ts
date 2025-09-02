import { NgZone, ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then((appRef: ApplicationRef) => {
    console.log('[Angular微应用] 应用启动成功');

    // 向主应用发送就绪消息
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'MICRO_APP_READY',
          appName: 'angular-micro-app',
        },
        '*'
      );
    }

    // 监听主应用消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'INIT_DATA') {
        console.log('[Angular微应用] 收到主应用初始化数据:', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);

    // 应用销毁时清理
    appRef.onDestroy(() => {
      window.removeEventListener('message', handleMessage);
    });
  })
  .catch((err) => console.error('[Angular微应用] 启动失败:', err));
