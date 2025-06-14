<template>
  <div class="main-layout">
    <header class="main-header">
      <router-link to="/" class="logo">墨韵读书会</router-link>
      <nav>
        <router-link to="/">主页</router-link>
        <router-link to="/books">书籍</router-link>
        <router-link to="/circle">圈子</router-link>
        <router-link to="/journal">书评</router-link>
        <router-link to="/chat">消息</router-link>
        <router-link to="/profile">个人中心</router-link>
        <!-- 圈子管理入口，仅教师/导师可见 -->
        <router-link v-if="isTeacher" to="/circle/manage">圈子管理</router-link>
        <button class="logout-btn" @click="logout">退出登录</button>
      </nav>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  computed: {
    isTeacher() {
      const user = this.$store?.state?.auth?.user
      return user && (user.role === 'teacher' || user.role === 'mentor')
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f8fafc;
}
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #22223b;
  color: #fff;
  padding: 0 2rem;
  height: 60px;
}
.logo {
  font-weight: bold;
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
}
nav {
  display: flex;
  align-items: center;
}
nav a {
  color: #fff;
  margin-left: 1.5rem;
  text-decoration: none;
}
nav a.router-link-active {
  border-bottom: 2px solid #409eff;
}
.logout-btn {
  margin-left: 1.5rem;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
}
.main-content {
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
}
</style>
