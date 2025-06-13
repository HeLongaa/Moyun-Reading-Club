// 检查并确保所有API路径和参数与后端一致
import http from '@/utils/api'

function adaptBook(raw) {
  if (!raw) return {};
  return {
    id: raw.id,
    isbn: raw.isbn,
    title: raw.title || raw.name || '',
    author: raw.author || '',
    publisher: raw.publisher || '',
    type: raw.type || '',
    description: raw.description || raw.desc || '',
    book_icon: raw.book_icon || raw.bookCover || raw.icon || '',
    local_path: raw.local_path || '',
    page: raw.page,
    publish_date: raw.publish_date,
    douban_score: raw.douban_score,
    bangumi_score: raw.bangumi_score,
    // 兼容更多字段
    ...raw
  }
}

export default {
    // 获取书籍列表（支持分页、类型、搜索）
    getBooks: async (params) => {
      const res = await http.get('/book', { params })
      if (res.data && Array.isArray(res.data.books)) {
        res.data.books = res.data.books.map(adaptBook)
      }
      return res
    },

    // 获取书籍详情
    getBookDetail: async (id) => {
      const res = await http.get(`/book/${id}`)
      if (res.data && res.data.data) {
        res.data.data = adaptBook(res.data.data)
      }
      return res
    },

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