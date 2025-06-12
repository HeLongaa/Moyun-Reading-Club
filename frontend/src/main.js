window.addEventListener('unhandledrejection', function(event) {
  alert('发生网络或系统错误，请稍后重试')
  event.preventDefault()
})

// 该报错通常由以下原因导致：
// 1. main.js 写法不符合 Vue3 规范（如直接调用 app.mount 前未 use router/store）。
// 2. 路由、store、插件等注册方式与 Vue3 不兼容。
// 3. 依赖版本不一致或 node_modules 缓存异常。

// 请确保 main.js 内容如下（Vue3标准写法）：

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(router).use(store).mount('#app')

// 彻底排查该报错的建议：
// 1. main.js 写法已正确，问题多为依赖冲突或 node_modules 缓存损坏。
// 2. 请严格执行以下操作：

// 步骤1：删除依赖缓存
// 在 frontend 目录下执行：
/*
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
*/

// 步骤2：确保 package.json 依赖如下（Vue3 及相关依赖均为4.x+）
// "vue": "^3.x.x",
// "vue-router": "^4.x.x",
// "vuex": "^4.x.x"

// 步骤3：确认 router/index.js 和 store/index.js 导出方式如下：
// export default router
// export default store

// 步骤4：如有 babel.config.js，内容如下：
// module.exports = { presets: ['@vue/cli-plugin-babel/preset'] }

// 步骤5：重启开发服务器
// npm run serve

// main.js 已正确，无需修改