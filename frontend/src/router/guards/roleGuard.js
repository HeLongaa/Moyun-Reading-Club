export default function roleGuard(requiredRoles) {
    return (to, from, next) => {
        const userRole = store.state.auth.user?.role
        if (!requiredRoles.includes(userRole)) {
            next('/forbidden')
        } else {
            next()
        }
    }
}