const state = {
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isAuthenticated: false
}

const mutations = {
    SET_TOKEN(state, { access, refresh }) {
        state.accessToken = access
        state.refreshToken = refresh
        state.isAuthenticated = true
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
    },

    SET_USER(state, user) {
        state.user = user
        state.isAuthenticated = true
    },

    LOGOUT(state) {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }
}

const actions = {
    async login({ commit }, credentials) {
        try {
            const response = await this.$authApi.login(credentials)
            commit('SET_TOKEN', {
                access: response.data.access,
                refresh: response.data.refresh
            })

            // 获取用户信息
            const profile = await this.$authApi.getUserProfile()
            commit('SET_USER', profile.data)

            return true
        } catch (error) {
            commit('LOGOUT')
            throw error
        }
    },

    async register({ commit }, userData) {
        try {
            const response = await this.$authApi.register(userData)
            return response.data
        } catch (error) {
            throw error
        }
    },

    async logout({ commit }) {
        try {
            await this.$authApi.logout()
        } finally {
            commit('LOGOUT')
        }
    },

    async refreshToken({ commit, state }) {
        try {
            const response = await this.$authApi.refreshToken({
                refresh: state.refreshToken
            })
            commit('SET_TOKEN', {
                access: response.data.access,
                refresh: state.refreshToken
            })
            return response.data.access
        } catch (error) {
            commit('LOGOUT')
            throw error
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}