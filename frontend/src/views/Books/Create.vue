<template>
  <div class="create-book">
    <h2>发布新书籍</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group"><label>书名</label><input v-model="form.title" required /></div>
      <div class="form-group"><label>作者</label><input v-model="form.author" required /></div>
      <div class="form-group"><label>出版社</label><input v-model="form.publisher" required /></div>
      <div class="form-group"><label>类型</label>
        <select v-model="form.type" required>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="form-group"><label>ISBN</label><input v-model="form.isbn" /></div>
      <div class="form-group"><label>页数</label><input v-model="form.page" type="number" /></div>
      <div class="form-group"><label>出版日期</label><input v-model="form.publish_date" type="date" /></div>
      <div class="form-group"><label>简介</label><textarea v-model="form.description" /></div>
      <div class="form-group"><label>豆瓣评分</label><input v-model="form.douban_score" type="number" step="0.1" /></div>
      <div class="form-group"><label>Bangumi评分</label><input v-model="form.bangumi_score" type="number" step="0.1" /></div>
      <div class="form-group"><label>豆瓣ID</label><input v-model="form.douban_id" /></div>
      <div class="form-group"><label>BangumiID</label><input v-model="form.bangumi_id" /></div>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <button type="submit" :disabled="loading">{{ loading ? '提交中...' : '提交书籍信息' }}</button>
    </form>
    <div v-if="bookId">
      <h3>上传书籍内容和封面</h3>
      <div class="form-group"><label>电子书文件</label><input type="file" @change="onBookFile" /></div>
      <button @click="uploadBookFile" :disabled="uploadingBook">{{ uploadingBook ? '上传中...' : '上传内容' }}</button>
      <div class="form-group"><label>封面图片</label><input type="file" @change="onCoverFile" /></div>
      <button @click="uploadBookCover" :disabled="uploadingCover">{{ uploadingCover ? '上传中...' : '上传封面' }}</button>
    </div>
    <div v-if="success" class="success-msg">书籍发布成功！</div>
  </div>
</template>
<script>
import { createBook, uploadBookFile, uploadBookCover } from '@/api/books.api'
import { getBookTypes } from '@/api/books.api'
export default {
  data() {
    return {
      form: {
        title: '', author: '', publisher: '', type: '', isbn: '', page: '', publish_date: '', description: '', douban_score: '', bangumi_score: '', douban_id: '', bangumi_id: ''
      },
      types: [],
      loading: false,
      error: null,
      bookId: null,
      bookFile: null,
      coverFile: null,
      uploadingBook: false,
      uploadingCover: false,
      success: false
    }
  },
  async created() {
    const res = await getBookTypes()
    this.types = res.data.data || []
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null
      try {
        const res = await createBook(this.form)
        if (res.data.success) {
          this.bookId = res.data.data.id || res.data.data.book_id
        } else {
          this.error = res.data.message || '提交失败'
        }
      } catch (e) {
        this.error = e.response?.data?.message || '提交失败'
      } finally {
        this.loading = false
      }
    },
    onBookFile(e) {
      this.bookFile = e.target.files[0]
    },
    async uploadBookFile() {
      if (!this.bookId || !this.bookFile) return
      this.uploadingBook = true
      try {
        await uploadBookFile(this.bookId, this.bookFile)
        this.success = true
      } catch (e) {
        alert('内容上传失败')
      } finally {
        this.uploadingBook = false
      }
    },
    onCoverFile(e) {
      this.coverFile = e.target.files[0]
    },
    async uploadBookCover() {
      if (!this.bookId || !this.coverFile) return
      this.uploadingCover = true
      try {
        await uploadBookCover(this.bookId, this.coverFile)
        this.success = true
      } catch (e) {
        alert('封面上传失败')
      } finally {
        this.uploadingCover = false
      }
    }
  }
}
</script>
<style scoped>
.create-book {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
input, select, textarea {
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
