<template>
  <div class="journal-detail">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <div v-else>
      <h2>{{ journal.title }}</h2>
      <div class="meta">
        <span>作者：{{ journal.author?.account || journal.author_id }}</span>
        <span>书籍：{{ journal.book?.title || journal.book_id }}</span>
        <span>发布时间：{{ journal.publish_time?.slice(0,16) }}</span>
      </div>
      <div class="content">{{ journal.content }}</div>
      <div class="actions">
        <button @click="likeJournal" :disabled="liked">👍 {{ journal.likes_count || journal.likesCount || 0 }} 赞</button>
        <button @click="showCommentBox = !showCommentBox">评论</button>
      </div>
      <div v-if="showCommentBox" class="comment-box">
        <textarea v-model="commentText" placeholder="写下你的评论..." rows="3"></textarea>
        <button @click="submitComment" :disabled="!commentText.trim()">提交</button>
      </div>
      <div class="comments-section">
        <h3>评论</h3>
        <div v-if="commentsLoading" class="loading">评论加载中...</div>
        <div v-else-if="commentsError" class="error-tip">{{ commentsError }}</div>
        <ul v-else>
          <li v-for="c in comments" :key="c.id" class="comment-item">
            <div class="comment-meta">
              <span class="author">{{ c.author?.account || c.author_id }}</span>
              <span class="time">{{ c.publish_time?.slice(0,16) }}</span>
            </div>
            <div class="comment-content">{{ c.content }}</div>
            <button @click="likeComment(c)" :disabled="c.liked">👍 {{ c.likeCount || 0 }}</button>
          </li>
          <li v-if="!comments.length" class="empty-tip">暂无评论</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import commentsApi from '@/api/comments.api'
export default {
  name: 'JournalDetail',
  data() {
    return {
      loading: true,
      error: '',
      journal: {},
      liked: false,
      showCommentBox: false,
      commentText: '',
      comments: [],
      commentsLoading: false,
      commentsError: ''
    }
  },
  async created() {
    await this.fetchDetail()
    await this.fetchComments()
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      this.error = ''
      try {
        const id = this.$route.params.id
        const res = await commentsApi.getJournal(id)
        this.journal = res.data?.data || res.data || {}
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || '加载失败'
      } finally {
        this.loading = false
      }
    },
    async likeJournal() {
      if (this.liked) return
      try {
        await commentsApi.likeJournal(this.$route.params.id)
        this.liked = true
        await this.fetchDetail()
      } catch (e) {
        this.error = '点赞失败'
      }
    },
    async fetchComments() {
      this.commentsLoading = true
      this.commentsError = ''
      try {
        const res = await commentsApi.getJournalComments(this.$route.params.id)
        this.comments = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      } catch (e) {
        this.commentsError = e?.response?.data?.error || e?.message || '评论加载失败'
      } finally {
        this.commentsLoading = false
      }
    },
    async submitComment() {
      if (!this.commentText.trim()) return
      try {
        await commentsApi.addJournalComment(this.$route.params.id, { content: this.commentText })
        this.commentText = ''
        this.showCommentBox = false
        await this.fetchComments()
      } catch (e) {
        this.commentsError = '评论失败'
      }
    },
    async likeComment(comment) {
      if (comment.liked) return
      try {
        await commentsApi.interact(comment.id, 'like')
        comment.liked = true
        comment.likeCount = (comment.likeCount || 0) + 1
      } catch (e) {
        this.commentsError = '评论点赞失败'
      }
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
  box-shadow: 0 2px 8px #eee;
  padding: 2rem;
}
.meta {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1.5rem;
}
.content {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #22223b;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.actions button {
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
}
.comment-box {
  margin-bottom: 1.5rem;
}
.comment-box textarea {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
  resize: vertical;
  margin-bottom: 8px;
}
.comment-box button {
  background: #409eff;
}
.comments-section {
  margin-top: 2rem;
}
.comment-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.comment-meta {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}
.comment-meta .author {
  font-weight: bold;
  color: #22223b;
}
.comment-content {
  margin-bottom: 0.5rem;
  color: #22223b;
}
.comment-item button {
  background: #eee;
  color: #409eff;
  border: none;
  border-radius: 4px;
  padding: 2px 12px;
  cursor: pointer;
  font-size: 0.95rem;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 1.5rem 0;
}
.loading, .error-tip {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.error-tip { color: #e74c3c; }
</style>
