/* eslint-disable @typescript-eslint/no-explicit-any */
import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import { routes } from './router'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(Antd)

// 添加通信逻辑
app.mixin({
  mounted() {
    // 只在根组件执行一次
    if (this.$el?.id === 'app') {
      // 向主应用发送就绪消息
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'MICRO_APP_READY',
            appName: 'vue-micro-app',
          },
          '*',
        )
      }

      // 监听主应用消息
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'INIT_DATA') {
          console.log('[Vue微应用] 收到主应用初始化数据:', event.data.data)
        }
      }

      window.addEventListener('message', handleMessage)

      // 组件卸载时清理
      this.$.appContext.app.onUnmounted(() => {
        window.removeEventListener('message', handleMessage)
      })
    }
  },
})

app.mount('#app')
