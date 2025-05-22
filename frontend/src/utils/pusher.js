import Pusher from 'pusher-js'

export default {
    install(Vue) {
        const pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
            cluster: 'mt1',
            forceTLS: true
        })

        Vue.prototype.$realtime = {
            subscribe: (channel, events) => {
                const ch = pusher.subscribe(channel)
                Object.entries(events).forEach(([event, callback]) => {
                    ch.bind(event, callback)
                })
                return ch
            },
            unsubscribe: (channel) => {
                pusher.unsubscribe(channel)
            }
        }
    }
}
export const initCommentChannel = (targetType, targetId) => {
    const channel = pusher.subscribe(`comments-${targetType}-${targetId}`)

    channel.bind('new_comment', (comment) => {
        store.commit('comments/ADD_COMMENT', {
            targetType,
            targetId,
            comment
        })
    })

    channel.bind('update_interaction', ({ comment_id, action, count }) => {
        store.commit('comments/UPDATE_INTERACTION_STATS', {
            commentId: comment_id,
            action,
            count
        })
    })
}
export function initNotificationChannel(userId) {
    const channel = pusher.subscribe(`private-user-${userId}`)

    channel.bind('new_notification', (data) => {
        store.dispatch('notifications/realtimeHandler', {
            ...data,
            id: `real_${Date.now()}`,
            read: false,
            created_at: new Date().toISOString()
        })
    })

    // 桌面通知处理
    channel.bind('new_notification', (data) => {
        if (Notification.permission === 'granted' && !document.hasFocus()) {
            new Notification('新通知', {
                body: this.renderNotificationBody(data),
                icon: data.actor_avatar
            })
        }
    })
}

// 在main.js初始化
if (store.state.auth.user) {
    initNotificationChannel(store.state.auth.user.id)
}