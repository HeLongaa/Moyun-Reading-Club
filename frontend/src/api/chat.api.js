import http from '@/utils/api'

const chatApi = {
  // 获取聊天列表
  getChatList: () => http.get('/chat'),
  // 获取与指定用户的聊天记录
  getMessages: (partnerId, params) => http.get(`/chat/${partnerId}`, { params }),
  // 发送消息
  sendMessage: (receiver_id, content) => http.post('/chat', { receiver_id, content })
}

export default chatApi
