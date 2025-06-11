import http from '@/utils/api'

export default {
    // 获取评论
    getComments: (targetId, params) => http.get(`/comments/${targetId}/`, { params }),

    // 发表评论
    postComment: (data) => http.post('/comments/', data),

    // 删除评论
    deleteComment: (commentId) => http.delete(`/comments/${commentId}/`),

    // 互动操作（点赞/收藏）
    interact: (commentId, action) => http.post(`/comments/${commentId}/interact/`, { action }),

    // 获取书评评论
    getJournalComments: (journalId) => http.get(`/journal/${journalId}/comments`),

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
    }
}