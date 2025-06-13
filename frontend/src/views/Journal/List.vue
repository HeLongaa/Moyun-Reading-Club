<template>
  <div class="journal-bg">
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
    <div class="journal-list">
      <h2>书评列表</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error-tip">{{ error }}</div>
      <ul v-else>
        <li v-for="journal in journals" :key="journal.id" class="journal-item" @click="goDetail(journal.id)">
          <div class="journal-title">{{ journal.title }}</div>
          <div class="journal-meta">
            作者：{{ journal.author?.account || journal.authorName || journal.author_id }} | 书籍：{{ journal.book?.title || journal.bookTitle || journal.book_id }}
          </div>
          <div class="journal-preview">{{ journal.content || journal.first_paragraph }}</div>
        </li>
        <li v-if="journals.length === 0" class="empty-tip">暂无书评</li>
      </ul>
    </div>
  </div>
</template>

<script>
import commentsApi from '@/api/comments.api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      journals: [],
      loading: true,
      error: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async created() {
    try {
      // 调试：打印接口响应内容
      const res = await commentsApi.getJournals()
      // eslint-disable-next-line no-console
      console.log('书评接口响应内容:', res)
      // 兼容所有常见结构
      if (res && res.data && Array.isArray(res.data.journals)) {
        this.journals = res.data.journals
      } else if (res && res.data && Array.isArray(res.data.data?.journals)) {
        this.journals = res.data.data.journals
      } else if (res && res.data && Array.isArray(res.data.data)) {
        this.journals = res.data.data
      } else if (res && res.data && Array.isArray(res.data.featuredJournals)) {
        this.journals = res.data.featuredJournals
      } else if (Array.isArray(res.data)) {
        this.journals = res.data
      } else {
        this.journals = []
      }
      // 调试：打印 journals 解析结果
      console.log('journals 解析结果:', this.journals)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('加载书评失败:', e, e?.response)
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
    goDetail(id) {
      this.$router.push({ name: 'JournalDetail', params: { id } })
    }
  }
}
</script>

<style scoped>
.journal-bg {
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
.journal-list {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 700px;
  margin: 120px auto 0;
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
.error-tip {
  color: #e63946;
  text-align: center;
  margin: 32px 0;
}
.journal-item {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.journal-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #22223b;
}
.journal-meta {
  color: #888;
  font-size: 0.98rem;
}
.journal-preview {
  color: #333;
  margin-bottom: 0.5em;
}
.journal-item button {
  align-self: flex-start;
  margin-top: 8px;
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
}
.empty-tip {
  text-align: center;
  color: #888;
  margin: 32px 0;
}
</style>
