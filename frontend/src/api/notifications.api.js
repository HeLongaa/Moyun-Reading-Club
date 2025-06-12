import http from '@/utils/api'

export default {
    // 获取未读消息
    getUnreadMessages: () => http.get('/message/unread'),
    // 标记书评评论为已读
    markJournalCommentAsRead: (commentId) => http.put(`/message/journal-comment/${commentId}/read`),
    // 标记圈子讨论回复为已读
    markDiscussionReplyAsRead: (replyId) => http.put(`/message/discussion-reply/${replyId}/read`),
    // 标记所有消息为已读
    markAllAsRead: () => http.put('/message/read-all')
}