<template>
  <div class="edit-book" v-if="book">
    <h2>编辑书籍</h2>
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
      <button type="submit" :disabled="loading">{{ loading ? '保存中...' : '保存修改' }}</button>
    </form>
    <div class="edit-uploads">
      <div class="form-group"><label>电子书文件</label><input type="file" @change="onBookFile" /></div>
      <button @click="uploadBookFile" :disabled="uploadingBook">{{ uploadingBook ? '上传中...' : '上传内容' }}</button>
      <div class="form-group"><label>封面图片</label><input type="file" @change="onCoverFile" /></div>
      <button @click="uploadBookCover" :disabled="uploadingCover">{{ uploadingCover ? '上传中...' : '上传封面' }}</button>
    </div>
    <button class="delete-btn" @click="deleteBook" :disabled="deleting">{{ deleting ? '删除中...' : '删除书籍' }}</button>
    <div v-if="success" class="success-msg">操作成功！</div>
  </div>
  <div v-else class="empty">未找到该书籍</div>
</template>
<script>
import { getBook, updateBook, deleteBook, uploadBookFile, uploadBookCover, getBookTypes } from '@/api/books.api'
export default {
  data() {
    return {
      book: null,
      form: {},
      types: [],
      loading: false,
      error: null,
      bookFile: null,
      coverFile: null,
      uploadingBook: false,
      uploadingCover: false,
      deleting: false,
      success: false
    }
  },
  async created() {
    const id = this.$route.params.id
    const [bookRes, typeRes] = await Promise.all([
      getBook(id),
      getBookTypes()
    ])
    this.book = bookRes.data.data || null
    this.types = typeRes.data.data || []
    if (this.book) {
      this.form = { ...this.book }
      if (this.form.publish_date) this.form.publish_date = this.form.publish_date.slice(0,10)
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null
      try {
        const res = await updateBook(this.book.id, this.form)
        if (res.data.success) {
          this.success = true
        } else {
          this.error = res.data.message || '保存失败'
        }
      } catch (e) {
        this.error = e.response?.data?.message || '保存失败'
      } finally {
        this.loading = false
      }
    },
    onBookFile(e) {
      this.bookFile = e.target.files[0]
    },
    async uploadBookFile() {
      if (!this.book.id || !this.bookFile) return
      this.uploadingBook = true
      try {
        await uploadBookFile(this.book.id, this.bookFile)
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
      if (!this.book.id || !this.coverFile) return
      this.uploadingCover = true
      try {
        await uploadBookCover(this.book.id, this.coverFile)
        this.success = true
      } catch (e) {
        alert('封面上传失败')
      } finally {
        this.uploadingCover = false
      }
    },
    async deleteBook() {
      if (!confirm('确定要删除该书籍吗？')) return
      this.deleting = true
      try {
        await deleteBook(this.book.id)
        this.$router.push('/books')
      } catch (e) {
        alert('删除失败')
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>
<style scoped>
.edit-book {
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
.delete-btn {
  background: #e74c3c;
  margin-top: 2rem;
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
.empty {
  color: #aaa;
  text-align: center;
  margin: 2rem 0;
}
</style>
