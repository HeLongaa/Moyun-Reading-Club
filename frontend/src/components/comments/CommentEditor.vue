<template>
  <div class="comment-editor">
    <div class="toolbar">
      <button @click="insertMention">@</button>
      <button @click="insertBold">B</button>
      <button @click="insertItalic">I</button>
    </div>

    <textarea
        ref="editor"
        v-model="content"
        @keydown.ctrl.enter="submit"
        placeholder="输入你的想法..."
    />

    <div class="preview" v-if="showPreview">
      <MarkdownContent :content="content" />
    </div>

    <div class="controls">
      <button @click="togglePreview">
        {{ showPreview ? '编辑' : '预览' }}
      </button>
      <button @click="submit">提交</button>
    </div>

    <MentionList
        v-if="showMentions"
        :search="mentionQuery"
        @select="insertMention"
    />
  </div>
</template>

<script>
import MarkdownContent from './MarkdownContent'

export default {
  components: { MarkdownContent },

  props: {
    parent: Object
  },

  data() {
    return {
      content: '',
      showPreview: false,
      showMentions: false,
      mentionQuery: ''
    }
  },

  methods: {
    insertMention(user) {
      this.content += `@${user.username} `
      this.showMentions = false
    },

    async submit() {
      if (this.content.trim()) {
        await this.$store.dispatch('comments/postComment', {
          content: this.content,
          targetType: this.$parent.targetType,
          targetId: this.$parent.targetId,
          parentId: this.parent?.id
        })
        this.content = ''
      }
    }
  }
}
</script>