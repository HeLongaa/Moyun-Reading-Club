import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './routes/authRoutes'
import booksRoutes from './routes/booksRoutes'
import circlesRoutes from './routes/circlesRoutes'
import commentsRoutes from './routes/commentsRoutes'
import notificationsRoutes from './routes/notificationsRoutes'
import authGuard from './guards/authGuard'
import roleGuard from './guards/roleGuard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    ...booksRoutes,
    ...circlesRoutes,
    ...commentsRoutes,
    ...notificationsRoutes,
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/Error/NotFound')
    }
  ]
})

router.beforeEach(authGuard)
router.beforeEach(roleGuard)

export default router