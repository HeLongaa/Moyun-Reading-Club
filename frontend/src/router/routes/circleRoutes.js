export default [
    {
        path: '/circle/create',
        name: 'CreateCircle',
        component: () => import('@/components/circles/CircleCreator'),
        meta: {
            requiresAuth: true,
            requiredRoles: ['mentor']
        }
    },
    {
        path: '/circle/join',
        name: 'JoinCircle',
        component: () => import('@/components/circles/CircleJoinForm'),
        meta: {
            requiresAuth: true,
            requiredRoles: ['student']
        }
    },
    {
        path: '/circle/:id',
        name: 'CircleDetail',
        component: () => import('@/views/Circle/CircleHome'),
        meta: { requiresAuth: true },
        props: true
    },
    {
        path: '/circle/manage',
        name: 'CircleManage',
        component: () => import('@/views/Circle/Manage.vue'),
        meta: {
            requiresAuth: true,
            requiredRoles: ['teacher', 'mentor']
        }
    }
]