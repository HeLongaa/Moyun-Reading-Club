import http from '@/utils/api'

export default {
    // 获取图书列表
    getBooks: (params) => http.get('/books/', { params }),

    // 获取图书详情
    getBookDetail: (bookId) => http.get(`/books/${bookId}/`),

    // 搜索图书
    searchBooks: (query) => http.get('/books/search/', { params: { q: query } }),

    // 分享到圈子
    shareToCircle: (bookId, circleId) => http.post(`/books/${bookId}/share/`, { circle_id: circleId }),

    // 获取推荐图书
    getRecommendations: () => http.get('/books/recommendations/')
}