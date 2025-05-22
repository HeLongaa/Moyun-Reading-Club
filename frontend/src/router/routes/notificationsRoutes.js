import NotificationsView from '@/views/Profile/Notifications.vue'

export default [
    {
        path: '/notifications',
        name: 'Notifications',
        component: NotificationsView,
        meta: {
            requiresAuth: true,
            title: '通知中心'
        }
    }
]