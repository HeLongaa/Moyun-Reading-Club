import circlesApi from '@/api/circles.api'

const state = {
  groups: [], // 圈子列表
  groupDetail: null, // 当前圈子详情
  members: [], // 当前圈子成员
  pendingMembers: [], // 待审核成员
  discussions: [], // 当前圈子讨论列表
  discussionDetail: null // 当前讨论详情
}

const mutations = {
  SET_GROUPS(state, groups) {
    state.groups = groups
  },
  SET_GROUP_DETAIL(state, detail) {
    state.groupDetail = detail
  },
  SET_MEMBERS(state, members) {
    state.members = members
  },
  SET_PENDING_MEMBERS(state, members) {
    state.pendingMembers = members
  },
  SET_DISCUSSIONS(state, discussions) {
    state.discussions = discussions
  },
  SET_DISCUSSION_DETAIL(state, detail) {
    state.discussionDetail = detail
  }
}

const actions = {
  async fetchGroups({ commit }, params) {
    const res = await circlesApi.getGroups(params)
    if (res.success) commit('SET_GROUPS', res.data?.groups || res.data?.list || [])
  },
  async fetchGroupDetail({ commit }, id) {
    const res = await circlesApi.getGroupDetail(id)
    if (res.success) commit('SET_GROUP_DETAIL', res.data)
  },
  async fetchMembers({ commit }, id) {
    try {
      const res = await circlesApi.getGroupMembers(id)
      // 兼容后端返回格式，确保是数组
      const members = res.data?.data || res.data || []
      commit('SET_MEMBERS', Array.isArray(members) ? members : [])
    } catch (e) {
      console.error('获取成员失败:', e)
      commit('SET_MEMBERS', [])
    }
  },
  async fetchPendingMembers({ commit }, id) {
    const res = await circlesApi.getPendingMembers(id)
    if (res.success) commit('SET_PENDING_MEMBERS', res.data)
  },
  async fetchDiscussions({ commit }, { id, params }) {
    const res = await circlesApi.getDiscussions(id, params)
    if (res.success) commit('SET_DISCUSSIONS', res.data?.discussions || res.data?.list || [])
  },
  async fetchDiscussionDetail({ commit }, { id, discussionId }) {
    const res = await circlesApi.getDiscussionDetail(id, discussionId)
    if (res.success) commit('SET_DISCUSSION_DETAIL', res.data)
  },
  clearGroupDetail({ commit }) {
    commit('SET_GROUP_DETAIL', null)
    commit('SET_MEMBERS', [])
    commit('SET_PENDING_MEMBERS', [])
    commit('SET_DISCUSSIONS', [])
    commit('SET_DISCUSSION_DETAIL', null)
  }
}

const getters = {
  groups: state => state.groups,
  groupDetail: state => state.groupDetail,
  members: state => Array.isArray(state.members) ? state.members : (state.members ? [state.members] : []),
  pendingMembers: state => state.pendingMembers,
  discussions: state => state.discussions,
  discussionDetail: state => state.discussionDetail
}

// Vuex actions 已正确调用 circlesApi，无需修改

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
