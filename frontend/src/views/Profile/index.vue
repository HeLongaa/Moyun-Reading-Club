<template>
  <div class="profile-bg">
    <div class="page-header">
      <img class="page-logo" src="@/assests/images/logo.png" alt="logo" />
      <div class="nav-btns">
        <router-link to="/">首页</router-link>
        <router-link to="/books">书籍</router-link>
        <router-link to="/journal">书评</router-link>
        <router-link to="/circle">圈子</router-link>
        <router-link to="/profile">我的</router-link>
        <router-link to="/search">搜索</router-link>
      </div>
    </div>
    <div class="profile-main">
      <!-- ...existing template code... -->
      <div class="profile-actions">
        <button class="circle-btn" @click="goEdit">编辑信息</button>
        <button class="circle-btn danger-btn" @click="logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getStats } from '@/api/profile.api'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      // ...existing data properties...
      stats: {},
    }
  },
  async created() {
    try {
      const res = await getStats()
      this.stats = res.data?.data || {}
    } catch (e) {
      // ...existing error handling code...
    }
    // ...existing code...
  },
  methods: {
    ...mapMutations('auth', ['LOGOUT']),
    goEdit() {
      this.$router.push('/profile/edit')
    },
    logout() {
      this.LOGOUT()
      this.$router.replace('/login')
    }
    // ...existing methods...
  },
}
</script>

<style scoped>
.profile-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  background: url('@/assests/images/moyun.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
}
.page-header {
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  align-items: center;
  z-index: 20;
}
.page-logo {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px #eee;
  object-fit: cover;
  border: 2px solid #e0e7ff;
  margin-right: 18px;
}
.nav-btns {
  display: flex;
  gap: 18px;
}
.nav-btns a {
  color: #409eff;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.85);
  transition: background 0.2s, color 0.2s;
}
.nav-btns a:hover {
  background: #409eff;
  color: #fff;
}
.profile-main {
  margin: 120px auto 0 auto;
  max-width: 600px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #eee;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-actions {
  display: flex;
  gap: 2rem;
  margin-top: 2.5rem;
  justify-content: center;
}
.circle-btn {
  background: linear-gradient(90deg,#409eff 60%,#6a82fb 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px #e0e7ff;
  transition: background 0.2s, box-shadow 0.2s;
}
.circle-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.circle-btn:hover:not(:disabled) {
  background: #337ecc;
}
.danger-btn {
  background: #e74c3c !important;
}
/* ...existing styles... */
</style>