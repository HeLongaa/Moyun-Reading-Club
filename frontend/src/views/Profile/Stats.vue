<template>
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
.profile-stats { max-width: 400px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.loading, .error-tip { text-align: center; color: #888; margin: 2rem 0; }
ul { list-style: none; padding: 0; }
li { margin-bottom: 1rem; font-size: 1.1rem; }
</style>
