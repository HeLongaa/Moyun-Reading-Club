<template>
  <div class="book-detail">
    <h2>{{ book.title }}</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="book-meta">
        <span>作者：{{ book.author }}</span>
        <span>出版社：{{ book.publisher }}</span>
        <span>类型：{{ book.type }}</span>
      </div>
      <div class="book-desc">
        <strong>简介：</strong>
        <p>{{ book.description }}</p>
      </div>
      <div class="book-actions">
        <router-link :to="`/journal?bookId=${book.id}`">查看书评</router-link>
        <button @click="shareBook">分享</button>
        <router-link to="/books">返回书籍列表</router-link>
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import booksApi from '@/api/books.api'

export default {
  name: 'BookDetail',
  data() {
    return {
      book: {},
      loading: true,
      error: ''
    }
  },
  async created() {
    try {
      const id = this.$route.params.id
      const res = await booksApi.getBookDetail(id)
      this.book = res.data.data || {}
    } catch (e) {
      this.error = '加载失败，请稍后重试'
    } finally {
      this.loading = false
    }
  },
  methods: {
    shareBook() {
      alert('分享功能开发中')
    }
  }
}
</script>

<style scoped>
.book-detail {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 24px;
}
.loading {
  text-align: center;
  color: #888;
  margin: 32px 0;
}
.error {
  color: #e63946;
  text-align: center;
  margin: 32px 0;
}
.book-meta {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 12px;
  display: flex;
  gap: 24px;
}
.book-desc {
  margin-bottom: 24px;
  color: #22223b;
  font-size: 1.05rem;
}
.book-actions {
  display: flex;
  gap: 16px;
}
.book-actions button {
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
}
</style>