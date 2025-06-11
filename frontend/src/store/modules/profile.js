import profileApi from '@/api/profile.api'

const state = {
  profile: null,
  stats: null
}

const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile
  },
  SET_STATS(state, stats) {
    state.stats = stats
  }
}

const actions = {
  async fetchProfile({ commit }, id) {
    const res = await profileApi.getProfile(id)
    if (res.data.success) {
      commit('SET_PROFILE', res.data.data)
    }
    return res
  },
  async updateProfile({ commit }, data) {
    const res = await profileApi.updateProfile(data)
    if (res.data.success) {
      commit('SET_PROFILE', res.data.data)
    }
    return res
  },
  async uploadPhoto({ commit }, formData) {
    const res = await profileApi.uploadPhoto(formData)
    // 上传头像后可选择刷新profile
    return res
  },
  async fetchStats({ commit }, id) {
    const res = await profileApi.getStats(id)
    if (res.data.success) {
      commit('SET_STATS', res.data.data)
    }
    return res
  }
}

const getters = {
  profile: state => state.profile,
  stats: state => state.stats
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
