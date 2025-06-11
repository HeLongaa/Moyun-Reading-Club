window.addEventListener('unhandledrejection', function(event) {
  alert('发生网络或系统错误，请稍后重试')
  event.preventDefault()
})

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  alert('应用发生错误：' + (err.message || err))
}

store.watch(
  (state) => state.auth.accessToken,
  async (token) => {
    if (token) {
      try {
        await store.dispatch('auth/getUserProfile')
      } catch (e) {
        store.dispatch('auth/logout')
      }
    }
  },
  { immediate: true }
)

app.use(store)
app.use(router)
app.mount('#app')