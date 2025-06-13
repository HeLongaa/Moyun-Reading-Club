<template>
  <div class="book-detail" v-if="book">
    <div class="book-header">
      <div class="book-info">
        <h2 class="book-title">{{ book.title }}</h2>
        <div class="book-meta">
          <span>作者：{{ book.author }}</span>
          <span>出版社：{{ book.publisher }}</span>
          <span>类型：{{ book.type }}</span>
        </div>
        <div class="book-meta">
          <span>ISBN：{{ book.isbn }}</span>
          <span>页数：{{ book.page }}</span>
          <span>出版日期：{{ book.publish_date?.slice(0,10) }}</span>
        </div>
      </div>
    </div>
    <div class="book-desc">
      <h3>简介</h3>
      <div class="book-description-content" v-html="fullDescription"></div>
    </div>
    <div class="journal-create-section">
      <button class="journal-btn" @click="showJournalBox = !showJournalBox">
        {{ showJournalBox ? '取消发表' : '发表书评' }}
      </button>
      <div v-if="showJournalBox" class="journal-create-box">
        <input v-model="journalTitle" placeholder="书评标题" class="journal-input" />
        <textarea v-model="journalContent" placeholder="书评内容" rows="6" class="journal-textarea"></textarea>
        <button class="journal-btn submit" @click="submitJournal" :disabled="!journalTitle.trim() || !journalContent.trim() || submitting">
          {{ submitting ? '提交中...' : '提交书评' }}
        </button>
        <div v-if="journalError" class="journal-error">{{ journalError }}</div>
        <div v-if="journalSuccess" class="journal-success">{{ journalSuccess }}</div>
      </div>
    </div>
    <div class="journal-list-section">
      <h3>书评</h3>
      <div v-if="journalsLoading" class="loading">书评加载中...</div>
      <div v-else-if="journalsError" class="error-msg">{{ journalsError }}</div>
      <ul v-else>
        <li v-for="j in journals" :key="j.id" class="journal-item">
          <div class="journal-title-row">
            <span class="journal-title">{{ j.title }}</span>
            <span class="journal-meta">
              by {{ j.author?.account || j.author_id }}
              <span v-if="j.publish_time"> · {{ j.publish_time.slice(0,16) }}</span>
            </span>
          </div>
          <div class="journal-content-preview">{{ j.first_paragraph || (j.content ? j.content.slice(0,80) : '') }}</div>
        </li>
        <li v-if="!journals.length" class="empty-tip">暂无书评</li>
      </ul>
    </div>
  </div>
  <div v-else class="empty">未找到该书籍</div>
</template>

<script>
import booksApi from '@/api/books.api'
import journalApi from '@/api/journal.api'

export default {
  name: 'BookDetail',
  data() {
    return {
      book: null,
      loading: true,
      error: '',
      showJournalBox: false,
      journalTitle: '',
      journalContent: '',
      submitting: false,
      journalError: '',
      journalSuccess: '',
      journals: [],
      journalsLoading: false,
      journalsError: ''
    }
  },
  async created() {
    try {
      const id = this.$route.params.id
      const res = await booksApi.getBookDetail(id)
      // 兼容后端返回结构
      this.book = res.data?.data || res.data || {}
      await this.fetchJournals()
    } catch (e) {
      this.error = e?.message || '加载失败'
    } finally {
      this.loading = false
    }
  },
  computed: {
    fullDescription() {
      // 优先展示 description 字段，兼容 content 字段
      return this.book?.description || this.book?.content || '暂无简介'
    },
    user() {
      // 兼容 Vue2/3，确保能拿到 user
      return this.$store?.state?.auth?.user || null
    }
  },
  methods: {
    shareBook() {
      alert('分享功能开发中')
    },
    async fetchJournals() {
      this.journalsLoading = true
      this.journalsError = ''
      try {
        const res = await journalApi.getJournals({ bookId: this.book.id })
        // 兼容返回结构
        this.journals = res.data?.data?.journals || res.data?.journals || []
      } catch (e) {
        this.journalsError = e?.response?.data?.error || e?.message || '书评加载失败'
      } finally {
        this.journalsLoading = false
      }
    },
    async submitJournal() {
      this.journalError = ''
      this.journalSuccess = ''
      if (!this.journalTitle.trim() || !this.journalContent.trim()) {
        this.journalError = '标题和内容不能为空'
        return
      }
      this.submitting = true
      try {
        if (!this.book || !this.book.id) {
          this.journalError = '书籍信息缺失，无法发表'
          this.submitting = false
          return
        }
        const res = await journalApi.createJournal({
          title: this.journalTitle,
          content: this.journalContent,
          book_id: this.book.id
        })
        if (res.data && (res.data.success === true || (typeof res.data.message === 'string' && res.data.message.includes('成功')))) {
          this.journalSuccess = '书评发表成功！'
          this.showJournalBox = false
          this.journalTitle = ''
          this.journalContent = ''
          this.journalError = ''
          await this.fetchJournals()
          // 立即刷新书评列表，不刷新整个页面
          return
        }
        if (res.data && res.data.error) {
          this.journalError = res.data.error
          return
        }
        if (res.data && res.data.message) {
          this.journalError = res.data.message
          return
        }
        // 不再设置 this.journalError = '发表失败'
      } catch (e) {
        this.journalError = e?.response?.data?.error || e?.response?.data?.message || e?.message || ''
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.book-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #e0e7ff;
  padding: 2.5rem 2rem 2rem 2rem;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  transition: box-shadow 0.2s;
}
.book-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1.2rem;
}
.book-info {
  flex: 1;
}
.book-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #22223b;
  margin-bottom: 0.7rem;
  letter-spacing: 2px;
  line-height: 1.2;
}
.book-meta {
  color: #4a4e69;
  font-size: 1.02rem;
  margin-bottom: 0.3rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.book-desc {
  margin-bottom: 2rem;
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1.2rem 1rem;
}
.book-desc h3 {
  font-size: 1.18rem;
  color: #409eff;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.empty {
  color: #aaa;
  text-align: center;
  margin: 2rem 0;
}
.book-description-content {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 1.05rem;
  color: #22223b;
  line-height: 1.8;
  margin-top: 0.5rem;
}
.journal-create-section {
  margin-top: 2rem;
}
.journal-btn {
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.45rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s;
}
.journal-btn.submit {
  margin-top: 0.7rem;
  background: #67c23a;
}
.journal-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.journal-create-box {
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.journal-input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 1.05rem;
}
.journal-textarea {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 1.05rem;
  resize: vertical;
}
.journal-error {
  color: #e74c3c;
  margin-top: 0.5rem;
}
.journal-success {
  color: #67c23a;
  margin-top: 0.5rem;
}
.journal-list-section {
  margin-top: 2.5rem;
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1.2rem 1rem;
}
.journal-list-section h3 {
  font-size: 1.13rem;
  color: #409eff;
  margin-bottom: 0.7rem;
  font-weight: 600;
}
.journal-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.journal-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.journal-title {
  font-weight: bold;
  color: #22223b;
  font-size: 1.08rem;
}
.journal-meta {
  color: #888;
  font-size: 0.97rem;
}
.journal-content-preview {
  color: #22223b;
  margin-top: 0.3rem;
  font-size: 1.01rem;
  line-height: 1.6;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 1.5rem 0;
}
.loading, .error-msg {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.error-msg { color: #e74c3c; }
@media (max-width: 800px) {
  .book-detail { padding: 1rem; }
  .book-header { flex-direction: column; gap: 1rem; }
}
</style>