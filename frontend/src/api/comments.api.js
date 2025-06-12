// 检查并确保所有API路径和参数与后端一致
import http from '@/utils/api'

export default {
    // 获取书评评论
    getJournalComments: (journalId, params) => http.get(`/journal/${journalId}/comments`, { params }),

    // 添加评论
    addJournalComment: (journalId, data) => http.post(`/journal/${journalId}/comments`, data),

    // 删除评论
    deleteJournalComment: (journalId, commentId) => http.delete(`/journal/${journalId}/comments/${commentId}`),

    // 点赞/取消点赞
    likeJournal: (journalId) => http.post(`/journal/${journalId}/like`),

    // 获取书评列表
    getJournals: (params) => http.get('/journal', { params }),

    // 获取书评详情
    getJournal: (id) => http.get(`/journal/${id}`),

    // 创建书评
    createJournal: (data) => http.post('/journal', data),

    // 编辑书评
    updateJournal: (id, data) => http.put(`/journal/${id}`, data),

    // 删除书评
    deleteJournal: (id) => http.delete(`/journal/${id}`),

    // 上传书评头图
    uploadJournalHeader: (id, file) => {
        const formData = new FormData()
        formData.append('header', file)
        return http.post(`/journal/upload-header/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    // 获取单条评论详情（如后端支持）
    getCommentDetail: (id) => http.get(`/comment/${id}`),

    // 评论点赞/互动（如后端支持）
    interact: (id, action) => http.post(`/comment/${id}/interact`, { action }),

    // 回复评论（如后端支持）
    replyComment: (id, data) => http.post(`/comment/${id}/reply`, data)
}