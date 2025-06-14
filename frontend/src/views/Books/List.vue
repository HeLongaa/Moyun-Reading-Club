<template>
  <div class="books-bg">
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
.books-bg {
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
.books-list {
  position: relative;
  z-index: 1;
  margin-top: 120px;
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
