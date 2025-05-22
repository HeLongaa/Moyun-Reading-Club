<template>
  <div class="comment-node" :style="{ marginLeft: depth * 30 + 'px' }">
    <div class="comment-header">
      <UserAvatar :user="comment.author" />
      <span class="username">{{ comment.author.name }}</span>
      <span class="time">{{ formatTime(comment.created_at) }}</span>

      <InteractionButton
          type="like"
          :count="comment.likes_count"
          :active="isLiked"
          @click="toggleLike"
      />
    </div>

    <MarkdownContent :content="comment.content" />

    <div v-if="showReply" class="reply-section">
      <CommentEditor
          :parent="comment"
          @submit="handleReplySubmit"
      />
    </div>

    <div class="actions">
      <button @click="toggleReply">回复</button>
      <button v-if="canDelete" @click="deleteComment">删除</button>
    </div>

    <div v-if="hasReplies" class="replies">
      <CommentNode
          v-for="replyId in comment.replies"
          :key="replyId"
          :comment="getComment(replyId)"
          :depth="depth + 1"
          @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object,
    depth: Number
  },

  data() {
    return {
      showReply: false
    }
  },

  computed: {
    isLiked() {
      return this.$store.state.comments.interactions[this.comment.id]?.like || false
    },
    canDelete() {
      return this.$store.state.auth.user?.id === this.comment.author.id ||
          this.$store.state.auth.user?.role === 'mentor'
    },
    hasReplies() {
      return this.comment.replies?.length > 0 && this.depth < this.maxDepth
    }
  },

  methods: {
    toggleReply() {
      this.showReply = !this.showReply
    },

    async toggleLike() {
      await this.$store.dispatch('comments/toggleInteraction', {
        commentId: this.comment.id,
        action: 'like'
      })
    },

    async deleteComment() {
      await this.$commentsApi.deleteComment(this.comment.id)
      this.$store.commit('comments/REMOVE_COMMENT', this.comment.id)
    },

    handleReplySubmit(content) {
      this.$emit('reply', {
        content,
        parentId: this.comment.id
      })
    }
  }
}
</script>