<template>
  <div class="books-list">
    <h2>书籍列表</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="book in books" :key="book.id" class="book-item">
        <div class="book-title">{{ book.title }}</div>
        <div class="book-author">作者：{{ book.author }}</div>
        <button @click="viewDetail(book.id)">查看详情</button>
      </li>
    </ul>
  </div>
</template>

<script>
import booksApi from '@/api/books.api'

export default {
  name: 'BooksList',
  data() {
    return {
      loading: true,
      books: [],
      error: ''
    }
  },
  async created() {
    try {
      const res = await booksApi.getBooks()
      // 兼容后端返回结构
      if (res && res.data && Array.isArray(res.data.books)) {
        this.books = res.data.books
      } else if (res && res.data && Array.isArray(res.data.data?.books)) {
        this.books = res.data.data.books
      } else {
        this.books = []
      }
    } catch (e) {
      // 新增详细错误输出
      // eslint-disable-next-line no-console
      console.error('加载书籍失败:', e, e?.response)
      if (e?.response?.data?.error) {
        this.error = e.response.data.error
      } else if (e?.message) {
        this.error = e.message
      } else {
        this.error = '加载失败，请稍后重试'
      }
    } finally {
      this.loading = false
    }
  },
  methods: {
    viewDetail(id) {
      this.$router.push({ name: 'BookDetail', params: { id } })
    }
  }
}
</script>

<style scoped>
.books-list {
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
.book-item {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.book-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #22223b;
}
.book-author {
  color: #888;
  font-size: 0.98rem;
}
.book-item button {
  align-self: flex-start;
  margin-top: 8px;
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
}
</style>
