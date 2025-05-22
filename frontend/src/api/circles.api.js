import http from '@/utils/api'

export default {
    // 创建学习圈
    createCircle: (circleData) => http.post('/circles/', circleData),

    // 获取可加入的圈子列表
    getAvailableCircles: () => http.get('/circles/available/'),

    // 加入学习圈
    joinCircle: (circleId) => http.post(`/circles/${circleId}/join/`),

    // 获取我的学习圈
    getMyCircles: () => http.get('/circles/me/'),

    // 获取圈子详情
    getCircleDetail: (circleId) => http.get(`/circles/${circleId}/`)
}