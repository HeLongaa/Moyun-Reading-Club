import http from '@/utils/api'

export default {
  // AI 书籍推荐
  recommendBooks: (data) => http.post('/public/recommend-books', data),
  // AI 聊天
  chat: (data) => http.post('/public/chat', data)
}
