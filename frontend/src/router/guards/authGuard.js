export default function authGuard(router, store) {
    router.beforeEach(async (to, from, next) => {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
        const isAuthenticated = store.getters['auth/isAuthenticated']

        // 需要登录但未认证
        if (requiresAuth && !isAuthenticated) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
            return
        }

        // 已认证但访问登录/注册页
        if (!requiresAuth && isAuthenticated) {
            next('/')
            return
        }

        // 检查Token有效性
        if (requiresAuth) {
            const isValid = await checkTokenValidity(store)
            if (!isValid) {
                next('/login')
                return
            }
        }

        next()
    })
}

async function checkTokenValidity(store) {
    const accessToken = store.state.auth.accessToken
    if (!accessToken) return false

    try {
        // 简单验证Token是否过期
        const { exp } = JSON.parse(atob(accessToken.split('.')[1]))
        if (exp * 1000 > Date.now()) return true

        // Token过期，尝试刷新
        await store.dispatch('auth/refreshToken')
        return true
    } catch (error) {
        store.commit('auth/LOGOUT')
        return false
    }
}