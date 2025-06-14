import chatApi from '@/api/chat.api'

const state = {
  chatList: [], // 聊天对象列表
  messages: {}, // { partnerId: [msg, ...] }
  currentPartner: null,
}

const mutations = {
  SET_CHAT_LIST(state, list) {
    state.chatList = list
  },
  SET_MESSAGES(state, { partnerId, messages }) {
    state.messages = { ...state.messages, [partnerId]: messages }
  },
  ADD_MESSAGE(state, { partnerId, message }) {
    if (!state.messages[partnerId]) state.messages[partnerId] = []
    state.messages[partnerId].push(message)
  },
  SET_CURRENT_PARTNER(state, partnerId) {
    state.currentPartner = partnerId
  }
}

const actions = {
  async fetchChatList({ commit }) {
    const res = await chatApi.getChatList()
    if (res.success) commit('SET_CHAT_LIST', res.data)
  },
  async fetchMessages({ commit }, { partnerId, params }) {
    const res = await chatApi.getMessages(partnerId, params)
    if (res.success) commit('SET_MESSAGES', { partnerId, messages: res.data.messages || res.data.list || [] })
  },
  async sendMessage({ commit }, { receiver_id, content }) {
    const res = await chatApi.sendMessage(receiver_id, content)
    if (res.success) commit('ADD_MESSAGE', { partnerId: receiver_id, message: res.data })
    return res
  },
  setCurrentPartner({ commit }, partnerId) {
    commit('SET_CURRENT_PARTNER', partnerId)
  }
}

const getters = {
  chatList: state => state.chatList,
  messages: state => partnerId => state.messages[partnerId] || [],
  currentPartner: state => state.currentPartner
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
