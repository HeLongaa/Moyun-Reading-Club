import notificationsApi from '@/api/notifications.api'

const state = {
  notifications: [],
  unreadCount: 0
}

const mutations = {
  SET_NOTIFICATIONS(state, list) {
    state.notifications = list
  },
  SET_UNREAD_COUNT(state, count) {
    state.unreadCount = count
  },
  MARK_AS_READ(state, id) {
    const n = state.notifications.find(n => n.id === id)
    if (n) n.read = true
    state.unreadCount = Math.max(0, state.unreadCount - 1)
  },
  MARK_ALL_AS_READ(state) {
    state.notifications.forEach(n => n.read = true)
    state.unreadCount = 0
  }
}

const actions = {
  async fetchNotifications({ commit }, params) {
    const res = await notificationsApi.getNotifications(params)
    if (res.success) commit('SET_NOTIFICATIONS', res.data.list || res.data)
  },
  async fetchUnreadCount({ commit }) {
    const res = await notificationsApi.getUnreadCount()
    if (res.success) commit('SET_UNREAD_COUNT', res.data.count || res.data)
  },
  async markAsRead({ commit }, id) {
    await notificationsApi.markAsRead(id)
    commit('MARK_AS_READ', id)
  },
  async markAllAsRead({ commit }) {
    await notificationsApi.markAllAsRead()
    commit('MARK_ALL_AS_READ')
  }
}

const getters = {
  notifications: state => state.notifications,
  unreadCount: state => state.unreadCount
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
