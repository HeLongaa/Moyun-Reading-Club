export default [
    {
        path: '/books',
        name: 'BookExplore',
        component: () => import('@/views/Books/Explore'),
        meta: { requiresAuth: true }
    },
    {
        path: '/books/:id',
        name: 'BookDetail',
        component: () => import('@/views/Books/Detail'),
        meta: { requiresAuth: true },
        props: true
    },
    {
        path: '/recommendations',
        name: 'Recommendations',
        component: () => import('@/views/Books/Recommendations'),
        meta: { requiresAuth: true }
    },
    {
        path: '/shared-books',
        name: 'SharedBooks',
        component: () => import('@/views/Books/SharedBooks'),
        meta: { requiresAuth: true }
    }
]