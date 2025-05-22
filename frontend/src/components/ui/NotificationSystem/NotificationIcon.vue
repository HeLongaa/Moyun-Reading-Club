<template>
  <div class="notification-icon">
    <component :is="iconComponent" :class="iconClass" />
  </div>
</template>

<script>
import CommentIcon from '@/assets/icons/comment.svg'
import MentionIcon from '@/assets/icons/mention.svg'
import LikeIcon from '@/assets/icons/like.svg'

export default {
  props: {
    type: String // comment, mention, like, circle, etc.
  },

  computed: {
    iconComponent() {
      const components = {
        comment: CommentIcon,
        mention: MentionIcon,
        like: LikeIcon,
        circle: 'group'
      }
      return components[this.type] || 'bell'
    },

    iconClass() {
      return `icon-${this.type}`
    }
  }
}
</script>