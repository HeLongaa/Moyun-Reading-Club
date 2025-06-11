import http from '@/utils/api'
import { mockBooks } from '../mock/data'

const useMock = process.env.NODE_ENV === 'development'

export default {
    // 获取图书列表
    getBooks: (params) => useMock ? Promise.resolve(mockBooks) : http.get('/books/', { params }),

    // 获取图书详情
    getBookDetail: (bookId) => http.get(`/books/${bookId}/`),

    // 搜索图书
    searchBooks: (query) => http.get('/books/search/', { params: { q: query } }),

    // 分享到圈子
    shareToCircle: (bookId, circleId) => http.post(`/books/${bookId}/share/`, { circle_id: circleId }),

    // 获取推荐图书
    getRecommendations: () => http.get('/books/recommendations/'),
    
    // 获取共享图书列表
    getSharedBooks: (circleId) => http.get(`/circles/${circleId}/books/`),
    
    // 取消分享图书
    unshareBook: (bookId, circleId) => http.delete(`/books/${bookId}/share/`, { data: { circle_id: circleId } }),

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