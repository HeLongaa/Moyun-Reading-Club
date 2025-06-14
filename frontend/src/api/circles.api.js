// 检查并确保所有API路径和参数与后端一致
import http from '@/utils/api'

const circlesApi = {
  // 获取圈子列表
  getGroups: (params) => http.get('/group', { params }),
  // 获取圈子详情
  getGroupDetail: (id) => http.get(`/group/${id}`),
  // 创建圈子
  createGroup: (data) => http.post('/group', data),
  // 编辑圈子
  updateGroup: (id, data) => http.put(`/group/${id}`, data),
  // 删除圈子
  deleteGroup: (id) => http.delete(`/group/${id}`),
  // 上传圈子图标
  uploadGroupIcon: (id, formData) => http.post(`/group/upload-icon/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // 加入圈子（需审核）
  joinGroup: (id) => http.post(`/group/${id}/join`),
  // 退出圈子
  quitGroup: (id) => http.post(`/group/${id}/leave`),
  // 获取圈子成员
  getGroupMembers: (id) => http.get(`/group/${id}/members`),
  // 获取待审核成员
  getPendingMembers: (groupId) => http.get(`/group/${groupId}/pending-members`),
  // 审核成员（isOno: true/false）
  reviewMember: (groupId, userId, data) => http.post(`/group/${groupId}/review/${userId}/`, data),
  // 获取圈子讨论列表
  getDiscussions: (id, params) => http.get(`/group/${id}/discussions`, { params }),
  // 获取讨论详情
  getDiscussionDetail: (id, discussionId) => http.get(`/group/${id}/discussions/${discussionId}`),
  // 创建讨论
  createDiscussion: (id, data) => http.post(`/group/${id}/discussions`, data),
  // 删除讨论
  deleteDiscussion: (id, discussionId) => http.delete(`/group/${id}/discussions/${discussionId}`),
  // 回复讨论
  replyDiscussion: (id, discussionId, data) => http.post(`/group/${id}/discussions/${discussionId}/reply`, data),
  // 获取讨论回复列表
  getDiscussionReplies: (id, discussionId) => http.get(`/group/${id}/discussions/${discussionId}/replies`)
}

// 不存在 /group/manage 这个接口，老师的圈子管理应调用 /group 并在前端筛选 founder_id 为自己
// 正确做法：只用 getGroups 获取全部圈子，然后前端过滤

export default circlesApi
// API接口定义与后端一致，无需修改