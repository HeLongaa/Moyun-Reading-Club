import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Home from '@/views/Home.vue'
import NotFound from '@/views/Error/NotFound.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import authGuard from './guards/authGuard'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
      },
      {
        path: 'books',
        name: 'BooksList',
        component: () => import('@/views/Books/List.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'books/:id',
        name: 'BookDetail',
        component: () => import('@/views/Books/Detail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle',
        name: 'CircleList',
        component: () => import('@/views/Circle/List.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/student',
        name: 'ProfileStudent',
        component: () => import('@/views/Profile/Student.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/mentor',
        name: 'ProfileMentor',
        component: () => import('@/views/Profile/Mentor.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard)

export default router