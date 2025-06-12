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
        path: 'chat',
        name: 'ChatWindow',
        component: () => import('@/views/Chat/ChatWindow.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'ProfileHome',
        component: () => import('@/views/Profile/Student.vue'),
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
      },
      {
        path: 'profile/notifications',
        name: 'ProfileNotifications',
        component: () => import('@/views/Profile/Notifications.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/edit',
        name: 'ProfileEdit',
        component: () => import('@/views/Profile/Edit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile/stats',
        name: 'ProfileStats',
        component: () => import('@/views/Profile/Stats.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'books/upload',
        name: 'BookUpload',
        component: () => import('@/views/Books/Upload.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/settings',
        name: 'CircleSettings',
        component: () => import('@/views/Circle/Settings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ai/recommend',
        name: 'AIRecommend',
        component: () => import('@/views/AI/Recommend.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ai/chat',
        name: 'AIChat',
        component: () => import('@/views/AI/Chat.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'journal',
        name: 'JournalList',
        component: () => import('@/views/Journal/List.vue'),
        meta: { requiresAuth: true }
      },
      // 检查未注册的页面，建议补充如下路由（如有对应 .vue 文件）：
      {
        path: 'journal/:id',
        name: 'JournalDetail',
        component: () => import('@/views/Journal/Detail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'journal/edit/:id',
        name: 'JournalEdit',
        component: () => import('@/views/Journal/Edit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/edit',
        name: 'CircleEdit',
        component: () => import('@/views/Circle/Edit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/join',
        name: 'CircleJoin',
        component: () => import('@/views/Circle/Join.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/discussion/:discussionId',
        name: 'DiscussionDetail',
        component: () => import('@/views/Circle/DiscussionDetail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id',
        name: 'CircleDetail',
        component: () => import('@/views/Circle/Detail.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'books/explore',
        name: 'BooksExplore',
        component: () => import('@/views/Books/Explore.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/discussion',
        name: 'CircleDiscussion',
        component: () => import('@/views/Circle/Discussion.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/library',
        name: 'CircleLibrary',
        component: () => import('@/views/Circle/Library.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/members',
        name: 'CircleMembers',
        component: () => import('@/views/Circle/Members.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'circle/:id/home',
        name: 'CircleHome',
        component: () => import('@/views/Circle/CircleHome.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
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