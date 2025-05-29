import http from '@/utils/api'

export default {
    getNotifications: (params) => http.get('/notifications/', { params }),
    markAsRead: (id) => http.patch(`/notifications/${id}/mark-read/`),
    markAllAsRead: () => http.post('/notifications/mark-all-read/'),
    
    getUnreadCount: () => http.get('/notifications/unread-count/'),
    
    getNotificationsByType: (type) => http.get(`/notifications/type/${type}/`)
}