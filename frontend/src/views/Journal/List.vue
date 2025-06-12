<template>
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
.journal-list {
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
