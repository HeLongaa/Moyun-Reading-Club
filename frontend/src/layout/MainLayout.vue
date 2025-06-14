<template>
  <div>
    <nav class="main-nav">
      <div class="nav-left">
        <router-link to="/" class="logo">墨云读书会</router-link>
        <router-link to="/search">搜索</router-link>
        <router-link to="/circle">圈子</router-link>
      </div>
      <div class="nav-right">
        <router-link v-if="user" :to="profilePath">个人中心</router-link>
        <span v-if="user">{{ user.account }} ({{ user.role==='teacher'?'教师':'学生' }})</span>
        <button v-if="user" @click="logout">退出</button>
        <router-link v-else to="/login">登录</router-link>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const user = computed(() => store.getters['auth/user'])
const profilePath = computed(() => user.value?.role === 'teacher' ? '/profile/mentor' : '/profile/student')
const logout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}
</script>
<style scoped>
.main-nav { display: flex; justify-content: space-between; align-items: center; background: #409eff; color: #fff; padding: 0.5rem 2rem; }
.nav-left, .nav-right { display: flex; align-items: center; gap: 1.5rem; }
.logo { font-weight: bold; font-size: 1.2rem; color: #fff; text-decoration: none; }
.router-link-active { text-decoration: underline; }
button { background: #fff; color: #409eff; border: none; border-radius: 4px; padding: 0.3rem 1rem; cursor: pointer; }
</style>
