<template>
  <div class="create-journal">
    <h2>发布书评</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group"><label>标题</label><input v-model="form.title" required /></div>
      <div class="form-group"><label>正文</label><textarea v-model="form.content" required /></div>
      <div class="form-group"><label>关联书籍ID</label><input v-model="form.book_id" required /></div>
      <div class="form-group"><label>头图</label><input type="file" @change="onHeaderFile" /></div>
      <button type="submit" :disabled="loading">{{ loading ? '发布中...' : '发布' }}</button>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="success" class="success-msg">发布成功！</div>
    </form>
  </div>
</template>
<script>
import commentsApi from '@/api/comments.api'
export default {
  data() {
    return {
      form: { title: '', content: '', book_id: '', header_image: '' },
      headerFile: null,
      loading: false,
      error: null,
      success: false
    }
  },
  methods: {
    onHeaderFile(e) {
      this.headerFile = e.target.files[0]
    },
    async handleSubmit() {
      this.loading = true
      this.error = null
      try {
        let headerPath = ''
        if (this.headerFile) {
          // 先创建空书评获取id
          const tmp = await commentsApi.createJournal({ ...this.form, content: '占位' })
          const id = tmp.data.data.id
          const res = await commentsApi.uploadJournalHeader(id, this.headerFile)
          headerPath = res.data.data.path
          await commentsApi.deleteJournal(id) // 删除占位
        }
        const res = await commentsApi.createJournal({ ...this.form, header_image: headerPath })
        if (res.data.success) {
          this.success = true
          this.$router.push(`/journal/${res.data.data.id}`)
        } else {
          this.error = res.data.message || '发布失败'
        }
      } catch (e) {
        this.error = e.response?.data?.message || '发布失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.create-journal {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.form-group { margin-bottom: 1rem; }
input, textarea { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { margin-top: 0.5rem; padding: 0.5rem 1.5rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
.error-msg { color: #e74c3c; margin-bottom: 1rem; text-align: center; }
.success-msg { color: #27ae60; margin-top: 1rem; text-align: center; }
</style>
