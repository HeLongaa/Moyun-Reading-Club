import authApi from '@/api/auth.api'

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
            const response = await authApi.login(credentials)
            // 登录接口返回token和用户信息
            const token = response.data.token || response.data.access || response.data
            commit('SET_TOKEN', { access: token, refresh: '' })
            // 获取用户信息
            const profile = await authApi.getUserProfile()
            commit('SET_USER', profile.data)
            return true
        } catch (error) {
            commit('LOGOUT')
            throw error
        }
    },
    async register({ commit }, userData) {
        try {
            const response = await authApi.register(userData)
            // 注册成功自动登录
            const token = response.data.token || response.data.access || response.data
            commit('SET_TOKEN', { access: token, refresh: '' })
            const profile = await authApi.getUserProfile()
            commit('SET_USER', profile.data)
            return true
        } catch (error) {
            commit('LOGOUT')
            throw error
        }
    },
    async logout({ commit }) {
        await authApi.logout()
        commit('LOGOUT')
    },
    async getUserProfile({ commit }) {
        const profile = await authApi.getUserProfile()
        commit('SET_USER', profile.data)
    }
}

const getters = {
    isAuthenticated: state => !!state.accessToken,
    user: state => state.user
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}