import axios from 'axios'
import store from '@/store'

const api = axios.create({
    // 检查 baseURL 是否和后端端口一致
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5001/api',
    timeout: 10000
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
    response => response.data,
    async error => {
        const originalRequest = error.config

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