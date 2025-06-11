import store from '@/store'

export default function authGuard(to, from, next) {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  // 需要认证的页面加 meta: { requiresAuth: true }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // 已登录访问登录/注册页自动跳主界面
    next({ path: '/' })
  } else {
    next()
  }
}