import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './routes/authRoutes'
import booksRoutes from './routes/booksRoutes'
import circlesRoutes from './routes/circlesRoutes'
import commentsRoutes from './routes/commentsRoutes'
import notificationsRoutes from './routes/notificationsRoutes'
import authGuard from './guards/authGuard'
import roleGuard from './guards/roleGuard'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/circle',
    name: 'CircleList',
    component: () => import('@/views/Circle/List.vue'),
    meta: { requiresAuth: true }
  },
  ...authRoutes,
  ...booksRoutes,
  ...circlesRoutes,
  ...commentsRoutes,
  ...notificationsRoutes,
  {
    path: '/profile/student',
    component: () => import('@/views/Profile/Student.vue'),
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },
  {
    path: '/profile/mentor',
    component: () => import('@/views/Profile/Mentor.vue'),
    meta: { requiresAuth: true },
    beforeEnter: authGuard
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/NotFound')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard)
router.beforeEach(roleGuard)

export default router