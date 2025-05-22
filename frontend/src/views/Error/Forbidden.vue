<template>
  <MainLayout>
    <div class="forbidden-container">
      <h1>403 禁止访问</h1>
      <p>您没有权限查看此页面</p>
      <div class="actions">
        <router-link to="/" class="home-btn">返回首页</router-link>
        <button @click="logout" class="logout-btn">重新登录</button>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout'

export default {
  components: { MainLayout },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="scss">
.forbidden-container {
  text-align: center;
  padding: 4rem;
  min-height: 60vh;

  h1 {
    font-size: 3rem;
    color: var(--color-danger);
    margin-bottom: 1rem;
  }

  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
}
</style>