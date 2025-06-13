<template>
  <div class="upload-bg">
    <div class="upload-card">
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
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="success" class="success-msg">上传成功！</div>
      </form>
    </div>
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
.upload-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  background: url('@/assests/images/moyun.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}
.upload-card {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 3.5rem auto 2.5rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #e0e7ff;
  padding: 2.5rem 2rem 2rem 2rem;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
h2 {
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 1.6rem;
  letter-spacing: 2px;
}
.form-group {
  margin-bottom: 1rem;
}
input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  margin-top: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.error-msg {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
}
.success-msg {
  color: #27ae60;
  margin-top: 1rem;
  text-align: center;
}
</style>
