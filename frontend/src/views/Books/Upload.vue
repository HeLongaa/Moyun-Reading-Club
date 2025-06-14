<template>
  <div class="book-upload">
    <h2>上传书籍</h2>
    <form @submit.prevent="handleUpload">
      <div class="form-group">
        <label>选择书籍文件</label>
        <input type="file" @change="onFileChange" accept=".pdf,.epub,.txt" required />
      </div>
      <div class="form-group">
        <label>选择封面图片</label>
        <input type="file" @change="onCoverChange" accept="image/*" />
      </div>
      <button type="submit" :disabled="loading">上传</button>
      <div v-if="error" class="error-tip">{{ error }}</div>
      <div v-if="success" class="success-tip">上传成功！</div>
    </form>
  </div>
</template>
<script>
import booksApi from '@/api/books.api'
export default {
  name: 'BookUpload',
  data() {
    return {
      file: null,
      cover: null,
      loading: false,
      error: '',
      success: false
    }
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0]
    },
    onCoverChange(e) {
      this.cover = e.target.files[0]
    },
    async handleUpload() {
      if (!this.file) {
        this.error = '请选择书籍文件'
        return
      }
      this.loading = true
      this.error = ''
      this.success = false
      try {
        // 假设已创建书籍并获得id
        const bookId = this.$route.query.bookId
        await booksApi.uploadBookFile(bookId, this.file)
        if (this.cover) {
          await booksApi.uploadBookCover(bookId, this.cover)
        }
        this.success = true
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || '上传失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.book-upload { max-width: 400px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.form-group { margin-bottom: 1rem; }
.error-tip { color: #e74c3c; margin-top: 1rem; }
.success-tip { color: #27ae60; margin-top: 1rem; }
</style>
