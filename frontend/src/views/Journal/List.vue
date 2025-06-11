<template>
  <div class="journal-list">
    <h2>书评列表</h2>
    <div class="journal-search">
      <input v-model="search" @keyup.enter="fetchJournals" placeholder="搜索书评/作者/书名..." />
      <button @click="fetchJournals">搜索</button>
    </div>
    <div v-for="journal in journals" :key="journal.id" class="journal-item" @click="goDetail(journal.id)">
      <h3>{{ journal.title }}</h3>
      <div class="meta">作者：{{ journal.author?.account || journal.author_id }} | 书籍：{{ journal.book?.title || journal.book_id }}</div>
      <div class="preview">{{ journal.content?.slice(0, 60) }}...</div>
    </div>
    <div class="pagination">
      <button :disabled="page===1" @click="page-- && fetchJournals()">上一页</button>
      <span>第{{ page }}页</span>
      <button :disabled="!hasMore" @click="page++ && fetchJournals()">下一页</button>
    </div>
    <router-link v-if="user && (user.role==='teacher'||user.role==='admin'||user.role==='student')" to="/journal/create" class="primary-btn">发布书评</router-link>
  </div>
</template>
<script>
import commentsApi from '@/api/comments.api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      journals: [],
      search: '',
      page: 1,
      limit: 10,
      total: 0
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    hasMore() {
      return this.page * this.limit < this.total
    }
  },
  created() {
    this.fetchJournals()
  },
  methods: {
    async fetchJournals() {
      const res = await commentsApi.getJournals({ page: this.page, limit: this.limit, search: this.search })
      this.journals = res.data.data.journals || []
      this.total = res.data.data.total || 0
    },
    goDetail(id) {
      this.$router.push(`/journal/${id}`)
    }
  }
}
</script>
<style scoped>
.journal-list {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.journal-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  cursor: pointer;
}
.journal-item:last-child { border-bottom: none; }
.meta { color: #888; font-size: 0.95em; margin: 0.5em 0; }
.preview { color: #333; margin-bottom: 0.5em; }
.journal-search { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
input { flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { padding: 0.5rem 1rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
.primary-btn { margin-top: 1rem; display: inline-block; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
</style>
