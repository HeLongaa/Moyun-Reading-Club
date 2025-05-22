export default [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Auth/Login'),
        meta: {
            layout: 'AuthLayout',
            requiresAuth: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Auth/Register'),
        meta: {
            layout: 'AuthLayout',
            requiresAuth: false
        }
    }
]