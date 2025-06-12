<template>
  <div class="ai-recommend">
    <h2>AI 书籍推荐</h2>
    <form @submit.prevent="handleRecommend">
      <input v-model="preferences" placeholder="请输入你的阅读偏好" />
      <button type="submit" :disabled="loading">获取推荐</button>
    </form>
    <div v-if="loading" class="loading">推荐中...</div>
    <div v-if="error" class="error-tip">{{ error }}</div>
    <ul v-if="books.length">
      <li v-for="(b, i) in books" :key="i">{{ b }}</li>
    </ul>
  </div>
</template>
<script>
import http from '@/utils/api'
export default {
  name: 'AIRecommend',
  data() {
    return {
      preferences: '',
      books: [],
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleRecommend() {
      this.loading = true
      this.error = ''
      this.books = []
      try {
        const res = await http.post('/public/recommend-books', { preferences: this.preferences })
        const rec = res.data?.data?.recommendations || res.data?.recommendations || ''
        this.books = rec.split(/\d+\.\s|\n/).filter(s => s.trim())
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || '推荐失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.ai-recommend { max-width: 500px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; }
</style>
