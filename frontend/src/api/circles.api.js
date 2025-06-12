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
  editGroup: (id, data) => http.put(`/group/${id}`, data),
  // 删除圈子
  deleteGroup: (id) => http.delete(`/group/${id}`),
  // 上传圈子图标
  uploadGroupIcon: (id, file) => {
    const form = new FormData()
    form.append('icon', file)
    return http.post(`/group/upload-icon/${id}`, form)
  },
  // 加入圈子（需审核）
  joinGroup: (id) => http.post(`/group/${id}/join`),
  // 退出圈子
  quitGroup: (id) => http.post(`/group/${id}/leave`),
  // 获取圈子成员
  getGroupMembers: (id) => http.get(`/group/${id}/members`),
  // 获取待审核成员
  getPendingMembers: (id) => http.get(`/group/${id}/agree-join`),
  // 审核成员（isOno: true/false）
  auditMember: (id, userId, isOno) => http.post(`/group/${id}/review/${userId}/`, { isOno }),
  // 获取圈子讨论列表
  getDiscussions: (id, params) => http.get(`/group/${id}/discussions`, { params }),
  // 获取讨论详情
  getDiscussionDetail: (id, discussionId) => http.get(`/group/${id}/discussions/${discussionId}`),
  // 创建讨论
  createDiscussion: (id, data) => http.post(`/group/${id}/discussions`, data),
  // 删除讨论
  deleteDiscussion: (id, discussionId) => http.delete(`/group/${id}/discussions/${discussionId}`),
  // 回复讨论
  replyDiscussion: (id, discussionId, data) => http.post(`/group/${id}/discussions/${discussionId}/reply`, data)
}

export default circlesApi