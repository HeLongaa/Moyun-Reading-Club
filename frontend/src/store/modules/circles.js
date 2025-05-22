const state = {
    myCircles: [],          // 用户所属的圈子
    availableCircles: [],    // 可加入的圈子列表
    currentCircle: null      // 当前查看的圈子
}

const mutations = {
    SET_MY_CIRCLES(state, circles) {
        state.myCircles = circles
    },

    SET_AVAILABLE_CIRCLES(state, circles) {
        state.availableCircles = circles
    },

    SET_CURRENT_CIRCLE(state, circle) {
        state.currentCircle = circle
    },

    ADD_CIRCLE(state, circle) {
        state.myCircles.push(circle)
    },

    UPDATE_MEMBER_COUNT(state, { circleId, count }) {
        const circle = state.myCircles.find(c => c.id === circleId)
        if (circle) circle.memberCount = count
    }
}

const actions = {
    async fetchAvailableCircles({ commit }) {
        const response = await this.$circlesApi.getAvailableCircles()
        commit('SET_AVAILABLE_CIRCLES', response.data)
    },

    async createCircle({ commit }, circleData) {
        const response = await this.$circlesApi.createCircle(circleData)
        commit('ADD_CIRCLE', response.data)
        return response.data
    },

    async joinCircle({ commit, dispatch }, circleId) {
        await this.$circlesApi.joinCircle(circleId)

        // 刷新用户信息和圈子列表
        await dispatch('auth/getUserProfile', null, { root: true })
        await dispatch('fetchAvailableCircles')
    },

    async fetchCircleDetail({ commit }, circleId) {
        const response = await this.$circlesApi.getCircleDetail(circleId)
        commit('SET_CURRENT_CIRCLE', response.data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}