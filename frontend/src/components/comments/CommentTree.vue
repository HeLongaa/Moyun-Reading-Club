<template>
  <div class="comment-tree">
    <div v-for="commentId in rootComments" :key="commentId">
      <CommentNode
          :comment="getComment(commentId)"
          :depth="0"
          @reply="handleReply"
      />
    </div>
  </div>
</template>

<script>
import CommentNode from './CommentNode'

export default {
  components: { CommentNode },

  props: {
    targetType: String,
    targetId: [String, Number],
    maxDepth: {
      type: Number,
      default: 3
    }
  },

  computed: {
    commentKey() {
      return `${this.targetType}_${this.targetId}`
    },
    rootComments() {
      return this.$store.state.comments.comments.get(this.commentKey)?.rootComments || []
    }
  },

  methods: {
    getComment(id) {
      return this.$store.state.comments.comments.get(this.commentKey)?.entities.get(id)
    },

    handleReply(parentComment) {
      this.$emit('reply', parentComment)
    }
  }
}
</script>