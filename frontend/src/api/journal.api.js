import http from '@/utils/api'

// 获取书评列表（支持传递 bookId/userId 等参数）
const getJournals = (params) => http.get('/journal', { params })
// 检查 deleteJournal 方法实现
const deleteJournal = (id) => http.delete(`/journal/${id}`)

export default {
  // ...existing code...
  getJournals,
  createJournal: (data) => http.post('/journal', data),
  deleteJournal,
  // ...existing code...
}