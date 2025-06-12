import authApi from '@/api/auth.api'

const state = {
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token') // 保证刷新后仍然为true
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
            const data = response.data || response
            const tokenData = data.data || data
            // 兼容 token 字段
            const access = tokenData.access || tokenData.token
            const refresh = tokenData.refresh || null
            if (!access) {
                throw new Error('登录失败，未返回访问令牌')
            }
            commit('SET_TOKEN', { access, refresh })
            // 获取用户信息
            const profileRes = await authApi.getUserProfile()
            const profileData = profileRes.data?.data || profileRes.data || profileRes
            commit('SET_USER', profileData)
            return true
        } catch (error) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            throw error
        }
    },
    async register({ commit }, userData) {
        try {
            const response = await authApi.register(userData)
            const data = response.data || response
            const tokenData = data.data || data
            // 兼容 token 字段
            const access = tokenData.access || tokenData.token
            const refresh = tokenData.refresh || null
            if (!access) {
                return '注册成功，请手动登录'
            }
            commit('SET_TOKEN', { access, refresh })
            // 获取用户信息
            const profileRes = await authApi.getUserProfile()
            const profileData = profileRes.data?.data || profileRes.data || profileRes
            commit('SET_USER', profileData)
            return true
        } catch (error) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            throw error
        }
    },
    async logout({ commit }) {
        try {
            await authApi.logout()
        } finally {
            commit('LOGOUT')
        }
    },
    async refreshToken({ commit, state }) {
        if (!state.refreshToken) {
            throw new Error('No refresh token available')
        }
        try {
            const response = await authApi.refreshToken()
            const { access, refresh } = response.data
            commit('SET_TOKEN', { access, refresh })
            return access
        } catch (error) {
            commit('LOGOUT')
            throw error
        }
    },
    async getUserProfile({ commit, state }) {
        if (!state.accessToken) {
            return
        }
        try {
            const profileRes = await authApi.getUserProfile()
            const profileData = profileRes.data?.data || profileRes.data || profileRes
            commit('SET_USER', profileData)
        } catch (e) {
            // token失效时自动登出
            commit('LOGOUT')
            // 新增详细错误日志
            // eslint-disable-next-line no-console
            console.error('获取用户信息失败:', e)
            throw e
        }
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