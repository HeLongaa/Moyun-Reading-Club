const state = {
    all: [],
    unreadCount: 0
}

const mutations = {
    SET_NOTIFICATIONS(state, notifications) {
        state.all = notifications
    },

    ADD_NOTIFICATION(state, notification) {
        state.all.unshift(notification)
        state.unreadCount += 1
    },

    MARK_AS_READ(state, id) {
        const index = state.all.findIndex(n => n.id === id)
        if (index !== -1 && !state.all[index].read) {
            state.all[index].read = true
            state.unreadCount -= 1
        }
    },

    MARK_ALL_READ(state) {
        state.all = state.all.map(n => ({ ...n, read: true }))
        state.unreadCount = 0
    }
}

const actions = {
    async fetchNotifications({ commit }) {
        const response = await this.$notificationsApi.getNotifications()
        commit('SET_NOTIFICATIONS', response.data)
    },

    async realtimeHandler({ commit }, notification) {
        commit('ADD_NOTIFICATION', notification)
        this.dispatch('checkDesktopNotification', notification)
    },
    
    async fetchUnreadCount({ commit }) {
        const response = await this.$notificationsApi.getUnreadCount()
        commit('SET_UNREAD_COUNT', response.data.count)
    },
    
    async fetchByType({ commit }, type) {
        const response = await this.$notificationsApi.getNotificationsByType(type)
        commit('SET_NOTIFICATIONS', response.data)
    }
}