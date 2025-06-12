<template>
  <div class="edit-journal" v-if="journal">
    <h2>编辑书评</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group"><label>标题</label><input v-model="form.title" required /></div>
      <div class="form-group"><label>正文</label><textarea v-model="form.content" required /></div>
      <div class="form-group"><label>头图</label><input type="file" @change="onHeaderFile" /></div>
      <button type="submit" :disabled="loading">{{ loading ? '保存中...' : '保存' }}</button>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="success" class="success-msg">保存成功！</div>
    </form>
  </div>
  <div v-else class="empty">未找到该书评</div>
</template>
<script>
import commentsApi from '@/api/comments.api'
export default {
  data() {
    return {
      journal: null,
      form: { title: '', content: '', header_image: '' },
      headerFile: null,
      loading: false,
      error: null,
      success: false
    }
  },
  async created() {
    const id = this.$route.params.id
    const res = await commentsApi.getJournal(id)
    this.journal = res.data.data || null
    if (this.journal) {
      this.form = { ...this.journal }
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
        let headerPath = this.form.header_image
        if (this.headerFile) {
          const res = await commentsApi.uploadJournalHeader(this.journal.id, this.headerFile)
          headerPath = res.data.data.path
        }
        const res = await commentsApi.updateJournal(this.journal.id, { ...this.form, header_image: headerPath })
        if (res.data.success) {
          this.success = true
          this.$router.push(`/journal/${this.journal.id}`)
        } else {
          this.error = res.data.message || '保存失败'
        }
      } catch (e) {
        this.error = e.response?.data?.message || '保存失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.edit-journal {
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
.empty { color: #aaa; text-align: center; margin: 2rem 0; }
</style>
