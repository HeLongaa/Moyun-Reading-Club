<template>
  <div class="comment-detail">
    <h2>评论详情</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="comment-meta">
        <span class="author">{{ comment.author?.account || comment.author_id }}</span>
        <span class="time">{{ comment.publish_time?.slice(0,16) }}</span>
      </div>
      <div class="comment-content">
        <p>{{ comment.content }}</p>
      </div>
      <div class="comment-actions">
        <button @click="likeComment" :disabled="liked">👍 {{ comment.likeCount || 0 }} 赞</button>
        <button @click="replying = !replying">回复</button>
      </div>
      <div v-if="replying" class="reply-box">
        <textarea v-model="replyText" placeholder="写下你的回复..." rows="3"></textarea>
        <button @click="submitReply" :disabled="!replyText.trim()">提交</button>
      </div>
      <div v-if="replies.length" class="replies">
        <div class="reply" v-for="reply in replies" :key="reply.id">
          <span class="reply-author">{{ reply.author?.account || reply.author_id }}</span>：
          <span class="reply-content">{{ reply.content }}</span>
          <span class="reply-time">{{ reply.publish_time?.slice(0,16) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commentsApi from '@/api/comments.api'

export default {
  name: 'CommentDetail',
  data() {
    return {
      loading: true,
      liked: false,
      replying: false,
      replyText: '',
      comment: {},
      replies: [],
      error: ''
    }
  },
  async created() {
    await this.fetchDetail()
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      this.error = ''
      try {
        const id = this.$route.params.id
        // 确认 commentsApi.getCommentDetail 存在
        const res = await commentsApi.getCommentDetail(id)
        this.comment = res.data.data || {}
        this.replies = this.comment.replies || []
      } catch (e) {
        this.error = '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    async likeComment() {
      if (!this.liked) {
        try {
          await commentsApi.interact(this.$route.params.id, 'like')
          this.liked = true
          await this.fetchDetail()
        } catch (e) {
          this.error = '点赞失败，请稍后重试'
        }
      }
    },
    async submitReply() {
      if (this.replyText.trim()) {
        try {
          await commentsApi.replyComment(this.$route.params.id, { content: this.replyText })
          this.replyText = ''
          this.replying = false
          await this.fetchDetail()
        } catch (e) {
          this.error = '回复失败，请稍后重试'
        }
      }
    }
  }
}
</script>

<style scoped>
.loading {
  text-align: center;
  color: #888;
  margin: 32px 0;
}
.comment-meta {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 8px;
}
.author {
  font-weight: bold;
  color: #22223b;
}
.time {
  font-size: 0.9em;
}
.comment-content {
  margin-bottom: 24px;
  font-size: 1.1rem;
  color: #22223b;
}
.comment-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.comment-actions button {
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.comment-actions button:disabled {
  background: #bfc0c0;
  cursor: not-allowed;
}
.reply-box {
  margin-bottom: 16px;
}
.reply-box textarea {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
  resize: vertical;
  margin-bottom: 8px;
}
.reply-box button {
  background: #22223b;
}
.replies {
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 12px;
}
.reply {
  margin-bottom: 8px;
  font-size: 0.98rem;
}
.reply-author {
  color: #4a4e69;
  font-weight: bold;
}
.reply-time {
  color: #aaa;
  font-size: 0.85em;
  margin-left: 8px;
}
.error {
  color: #e63946;
  text-align: center;
  margin: 32px 0;
}
</style>
