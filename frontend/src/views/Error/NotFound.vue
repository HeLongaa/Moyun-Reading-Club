<template>
  <MainLayout>
    <div class="not-found-container">
      <h1>404 - 页面未找到</h1>
      <p>您访问的页面不存在</p>
      <div class="actions">
        <router-link :to="{ name: 'Home' }" class="home-button">
          返回首页
        </router-link>
        <button @click="$router.go(-1)" class="back-button">
          返回上一页
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  components: {
    MainLayout
  }
}
</script>

<style lang="scss" scoped>
.not-found-container {
  text-align: center;
  padding: 3rem;
  min-height: 70vh;

  h1 {
    font-size: 2.8rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  .actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;

    .home-button {
      @include primary-button;
    }

    .back-button {
      @include secondary-button;
    }
  }
}
</style>