<template>
  <div class="journal-detail" v-if="journal">
    <h2>{{ journal.title }}</h2>
    <div class="meta">作者：{{ journal.author?.account || journal.author_id }} | 书籍：{{ journal.book?.title || journal.book_id }}</div>
    <img v-if="journal.header_image" :src="journal.header_image" class="header-img" alt="头图" />
    <div class="content">{{ journal.content }}</div>
    <div class="actions">
      <button @click="likeJournal">👍 点赞 ({{ journal.likes_count || 0 }})</button>
      <router-link v-if="canEdit" :to="`/journal/edit/${journal.id}`">编辑</router-link>
      <button v-if="canEdit" @click="deleteJournal">删除</button>
    </div>
    <CommentList :journal-id="journal.id" />
  </div>
  <div v-else class="empty">未找到该书评</div>
</template>
<script>
import commentsApi from '@/api/comments.api'
import CommentList from '@/components/comments/CommentList.vue'
import { mapGetters } from 'vuex'
export default {
  components: { CommentList },
  data() {
    return { journal: null }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    canEdit() {
      return this.user && (this.user.id === this.journal?.author_id || this.user.role === 'admin')
    }
  },
  async created() {
    const id = this.$route.params.id
    const res = await commentsApi.getJournal(id)
    this.journal = res.data.data || null
  },
  methods: {
    async likeJournal() {
      if (!this.journal) return
      await commentsApi.likeJournal(this.journal.id)
      const res = await commentsApi.getJournal(this.journal.id)
      this.journal = res.data.data || null
    },
    async deleteJournal() {
      if (!confirm('确定要删除该书评吗？')) return
      await commentsApi.deleteJournal(this.journal.id)
      this.$router.push('/journal')
    }
  }
}
</script>
<style scoped>
.journal-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.header-img {
  width: 100%; max-width: 400px; margin: 1rem 0; border-radius: 8px;
}
.meta { color: #888; font-size: 0.95em; margin: 0.5em 0; }
.content { margin: 1.5em 0; color: #333; }
.actions { margin-bottom: 1.5em; display: flex; gap: 1rem; align-items: center; }
button { padding: 0.3rem 1rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
.empty { color: #aaa; text-align: center; margin: 2rem 0; }
</style>
