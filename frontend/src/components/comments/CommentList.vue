<template>
  <div class="comment-list">
    <h3>评论</h3>
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <div class="meta">{{ comment.author?.account || comment.author_id }} · {{ comment.created_at?.slice(0,10) }}</div>
      <div class="content">{{ comment.content }}</div>
      <button v-if="canDelete(comment)" @click="deleteComment(comment.id)">删除</button>
    </div>
    <form @submit.prevent="addComment" class="add-comment">
      <input v-model="content" placeholder="写下你的评论..." required />
      <button type="submit">发布</button>
    </form>
  </div>
</template>
<script>
import commentsApi from '@/api/comments.api'
import { mapGetters } from 'vuex'
export default {
  props: { journalId: { type: [String, Number], required: true } },
  data() {
    return { comments: [], content: '' }
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  created() {
    this.fetchComments()
  },
  methods: {
    async fetchComments() {
      const res = await commentsApi.getJournalComments(this.journalId)
      this.comments = res.data.data || []
    },
    async addComment() {
      if (!this.content) return
      await commentsApi.addJournalComment(this.journalId, { content: this.content })
      this.content = ''
      this.fetchComments()
    },
    async deleteComment(id) {
      await commentsApi.deleteJournalComment(this.journalId, id)
      this.fetchComments()
    },
    canDelete(comment) {
      return this.user && (this.user.id === comment.author_id || this.user.role === 'admin')
    }
  }
}
</script>
<style scoped>
.comment-list {
  margin-top: 2rem;
  background: #fafbfc;
  border-radius: 8px;
  padding: 1rem;
}
.comment-item {
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0;
}
.comment-item:last-child { border-bottom: none; }
.meta { color: #888; font-size: 0.9em; margin-bottom: 0.2em; }
.content { color: #333; margin-bottom: 0.2em; }
.add-comment { display: flex; gap: 0.5rem; margin-top: 1rem; }
input { flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { padding: 0.3rem 1rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
</style>
