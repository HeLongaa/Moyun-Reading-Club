export default [
    {
        path: '/circle/:id',
        name: 'CircleHome',
        component: () => import('@/views/Circle/CircleHome'),
        meta: { requiresAuth: true },
        props: true,
        children: [
            {
                path: 'discussion',
                name: 'CircleDiscussion',
                component: () => import('@/views/Circle/Discussion')
            },
            {
                path: 'library',
                name: 'CircleLibrary',
                component: () => import('@/views/Circle/Library')
            },
            {
                path: 'settings',
                name: 'CircleSettings',
                component: () => import('@/views/Circle/Settings')
            }
        ]
    }
]