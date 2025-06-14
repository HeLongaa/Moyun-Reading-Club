import axios from 'axios'
import store from '@/store'

const api = axios.create({
    // 优先使用 .env 配置的 VUE_APP_API_BASE_URL
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5001/api',
    timeout: 20000 // 增大超时时间，防止AI推荐超时
})

// 请求拦截器
api.interceptors.request.use(config => {
    const token = store.state.auth.accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器
api.interceptors.response.use(
    response => response, // 保留原始response对象
    async error => {
        const originalRequest = error.config

        // 404错误处理：接口未找到时给出友好提示
        if (error.response && error.response.status === 404) {
            // 可选：全局弹窗或页面提示
            alert('请求的接口不存在（404），请检查API路径或联系管理员')
            return Promise.reject(error)
        }

        // Token过期自动刷新
        if (error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            store.state.auth.refreshToken) {
            
            originalRequest._retry = true

            try {
                const newToken = await store.dispatch('auth/refreshToken')
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return api(originalRequest)
            } catch (refreshError) {
                // 刷新失败时跳转登录页
                store.commit('auth/LOGOUT')
                window.location.href = '/login?session_expired=1'
                return Promise.reject(refreshError)
            }
        }

        // 新增：未登录时（无token）访问受保护接口，直接跳转登录页
        if (error.response &&
            error.response.status === 401 &&
            !store.state.auth.accessToken) {
            store.commit('auth/LOGOUT')
            window.location.href = '/login'
            return Promise.reject(error)
        }

        return Promise.reject(error)
    }
)

export default api