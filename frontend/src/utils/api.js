import axios from 'axios'
import store from '@/store'

const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const newToken = await store.dispatch('auth/refreshToken')
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return api(originalRequest)
            } catch (refreshError) {
                store.commit('auth/LOGOUT')
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api