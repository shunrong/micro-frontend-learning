import { NgZone, ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import './public-path';

let appInstance: ApplicationRef | null = null;

function render(props: any = {}) {
  const { container } = props;

  return bootstrapApplication(App, appConfig)
    .then((appRef) => {
      appInstance = appRef;
      console.log('[angular微应用] 应用已挂载', container);
      return appRef;
    })
    .catch((err) => console.error('[angular微应用] 启动失败:', err));
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

// 将生命周期函数挂载到全局
(window as any)['angular-micro-app'] = {
  async bootstrap() {
    console.log('[angular微应用] bootstrap');
  },
  async mount(props: any) {
    console.log('[angular微应用] mount', props);
    return render(props);
  },
  async unmount(props: any) {
    console.log('[angular微应用] unmount', props);
    if (appInstance) {
      appInstance.destroy();
      appInstance = null;
    }
  },
};

// 导出 qiankun 生命周期函数（兼容性）
export async function bootstrap() {
  console.log('[angular微应用] bootstrap');
}

export async function mount(props: any) {
  console.log('[angular微应用] mount', props);
  return render(props);
}

export async function unmount(props: any) {
  console.log('[angular微应用] unmount', props);
  if (appInstance) {
    appInstance.destroy();
    appInstance = null;
  }
}
