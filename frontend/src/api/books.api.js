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
    unshareBook: (bookId, circleId) => http.delete(`/books/${bookId}/share/`, { data: { circle_id: circleId } })
}