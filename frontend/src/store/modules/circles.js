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
    },

    async updateCircle({ commit, state }, { circleId, data }) {
        const response = await this.$circlesApi.updateCircle(circleId, data)
        commit('SET_CURRENT_CIRCLE', response.data)
        
        // 更新我的圈子列表中的信息
        const index = state.myCircles.findIndex(c => c.id === circleId)
        if (index !== -1) {
            commit('SET_MY_CIRCLES', [
                ...state.myCircles.slice(0, index),
                response.data,
                ...state.myCircles.slice(index + 1)
            ])
        }
    },

    async fetchCircleMembers({ commit }, circleId) {
        const response = await this.$circlesApi.getCircleMembers(circleId)
        commit('SET_CURRENT_CIRCLE', {
            ...state.currentCircle,
            members: response.data
        })
    },

    async updateMemberRole({ dispatch }, { circleId, userId, role }) {
        await this.$circlesApi.updateMemberRole(circleId, userId, role)
        await dispatch('fetchCircleMembers', circleId)
    },

    async deleteCircle({ commit, state }, circleId) {
        await this.$circlesApi.deleteCircle(circleId)
        commit('SET_MY_CIRCLES', state.myCircles.filter(c => c.id !== circleId))
        commit('SET_CURRENT_CIRCLE', null)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}