import http from '@/utils/api'

export default {
    // 用户登录
    login: (credentials) => http.post('/auth/login/', credentials),

    // 用户注册
    register: (userData) => http.post('/auth/register/', userData),

    // 刷新Token
    refreshToken: () => http.post('/auth/token/refresh/'),

    // 获取用户信息
    getUserProfile: () => http.get('/auth/profile/'),

    // 退出登录
    logout: () => http.post('/auth/logout/')
}