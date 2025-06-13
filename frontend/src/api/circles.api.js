// 检查并确保所有API路径和参数与后端一致
import http from '@/utils/api'

function adaptGroup(raw) {
  if (!raw) return {};
  return {
    id: raw.id,
    name: raw.name || raw.title || '',
    description: raw.description || raw.desc || '',
    icon: raw.icon || raw.group_icon || '',
    founder: raw.founder || {},
    member_count: raw.member_count || raw.members_count || 0,
    discussion_count: raw.discussion_count || 0,
    created_at: raw.created_at,
    // 兼容更多字段
    ...raw
  }
}

const circlesApi = {
  // 获取圈子列表
  getGroups: async (params) => {
    const res = await http.get('/group', { params })
    if (res.data && Array.isArray(res.data.groups)) {
      res.data.groups = res.data.groups.map(adaptGroup)
    }
    return res
  },
  // 获取圈子详情
  getGroupDetail: async (id) => {
    const res = await http.get(`/group/${id}`)
    if (res.data && res.data.data) {
      res.data.data = adaptGroup(res.data.data)
    }
    return res
  },
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
  getPendingMembers: (groupId) => http.get(`/group/${groupId}/agree-join`),
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

export default circlesApi