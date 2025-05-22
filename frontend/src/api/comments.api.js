import http from '@/utils/api'

export default {
    // 获取评论
    getComments: (targetId, params) => http.get(`/comments/${targetId}/`, { params }),

    // 发表评论
    postComment: (data) => http.post('/comments/', data),

    // 删除评论
    deleteComment: (commentId) => http.delete(`/comments/${commentId}/`),

    // 互动操作（点赞/收藏）
    interact: (commentId, action) => http.post(`/comments/${commentId}/interact/`, { action })
}