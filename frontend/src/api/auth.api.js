import http from '@/utils/api'

export default {
    // 用户登录
    login: (credentials) => http.post('/account/login', credentials),

    // 用户注册
    register: (userData) => http.post('/account/register', userData),
    // 刷新Token
    refreshToken: () => http.post('/auth/token/refresh/'),

    // 获取用户信息
    getUserProfile: () => http.get('/account/me'),

    // 退出登录（修正：后端未实现该接口，前端无需请求，直接本地清理即可）
    // logout: () => http.post('/account/logout'),

    // 修改密码
    changePassword: (data) => http.post('/account/change-password', data),

    // 请求重置密码
    requestPasswordReset: (data) => http.post('/account/request-password-reset', data),

    // 重置密码
    resetPassword: (data) => http.post('/account/reset-password', data)
}