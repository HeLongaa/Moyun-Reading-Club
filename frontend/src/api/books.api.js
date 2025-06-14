// 检查并确保所有API路径和参数与后端一致
import http from '@/utils/api'

export default {
    // 获取书籍列表（支持分页、类型、搜索）
    getBooks: (params) => http.get('/book', { params }),

    // 获取书籍详情
    getBookDetail: (id) => http.get(`/book/${id}`),

    // 获取书籍类型
    getBookTypes: () => http.get('/book/types'),

    // 创建书籍
    createBook: (data) => http.post('/book', data),

    // 编辑书籍
    updateBook: (id, data) => http.put(`/book/${id}`, data),

    // 删除书籍
    deleteBook: (id) => http.delete(`/book/${id}`),

    // 上传书籍内容
    uploadBookFile: (id, file) => {
        const formData = new FormData()
        formData.append('book', file)
        return http.post(`/book/upload/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },

    // 上传书籍封面
    uploadBookCover: (id, file) => {
        const formData = new FormData()
        formData.append('cover', file)
        return http.post(`/book/upload-cover/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}