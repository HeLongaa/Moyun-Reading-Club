export default [
    {
        path: '/comments/:id',
        name: 'CommentDetail',
        component: () => import('@/views/Comments/Detail.vue'),
        meta: {
            requiresAuth: true,
            scrollToComment: true
        }
    }
]