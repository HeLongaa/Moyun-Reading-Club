import http from '@/utils/api'

// AI相关接口调用方式如下：

export default {
  recommendBooks: (data) => http.post('/public/recommend-books', data),
  chat: (data) => http.post('/public/chat', data)
}
 