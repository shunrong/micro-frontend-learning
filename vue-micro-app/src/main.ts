/* eslint-disable @typescript-eslint/no-explicit-any */
import './public-path'
import './assets/main.css'

import { createApp, type App as VueApp } from 'vue'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import { routes } from './router'

let instance: VueApp<Element> | null = null
let router: Router | null = null

function render(props: any = {}) {
  const { container } = props
  router = createRouter({
    history: createWebHistory((window as any).__POWERED_BY_QIANKUN__ ? '/product' : '/'),
    routes,
  })

  instance = createApp(App)
  instance.use(router)
  instance.use(Antd)

  const containerEl = container?.querySelector('#app') || '#app'
  instance.mount(containerEl)
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('[vue微应用] bootstrap')
}

export async function mount(props: any) {
  console.log('[vue微应用] mount', props)
  render(props)
}

export async function unmount() {
  console.log('[vue微应用] unmount')
  if (instance) {
    instance.unmount()
    instance = null
    router = null
  }
}
