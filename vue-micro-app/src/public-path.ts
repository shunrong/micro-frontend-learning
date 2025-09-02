// 动态设置 webpack public path，用于解决微应用资源路径问题
declare let __webpack_public_path__: string

interface QiankunWindow extends Window {
  __POWERED_BY_QIANKUN__?: boolean
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string
}

if ((window as QiankunWindow).__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line
  __webpack_public_path__ = (window as QiankunWindow).__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || ''
}

// 使文件成为模块
export {}
