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
    <div class="profile-stats">
      <h2>个人统计</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error-tip">{{ error }}</div>
      <div v-else>
        <ul>
          <li>书评数：{{ stats.journalCount }}</li>
          <li>点赞数：{{ stats.likeCount }}</li>
          <li>评论数：{{ stats.commentCount }}</li>
          <li>圈子数：{{ stats.groupCount }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getStats } from '@/api/profile.api'
export default {
  name: 'ProfileStats',
  data() {
    return {
      stats: {},
      loading: true,
      error: ''
    }
  },
  async created() {
    try {
      const res = await getStats()
      this.stats = res.data?.data || {}
    } catch (e) {
      this.error = e?.response?.data?.error || e?.message || '加载失败'
    } finally {
      this.loading = false
    }
  }
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
.profile-stats {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 400px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 2rem;
}
.loading, .error-tip { text-align: center; color: #888; margin: 2rem 0; }
ul { list-style: none; padding: 0; }
li { margin-bottom: 1rem; font-size: 1.1rem; }
</style>
