<template>
  <div class="book-detail" v-if="book">
    <div class="detail-header">
      <img :src="book.book_icon || '/bookCover/default.png'" class="detail-cover" alt="封面" />
      <div class="detail-info">
        <h2>{{ book.title }}</h2>
        <div class="meta">
          <span>作者：{{ book.author }}</span>
          <span>出版社：{{ book.publisher }}</span>
          <span>类型：{{ book.type }}</span>
        </div>
        <div class="desc">{{ book.description }}</div>
      </div>
    </div>
    <div class="detail-extra">
      <div>ISBN：{{ book.isbn }}</div>
      <div>页数：{{ book.page }}</div>
      <div>出版日期：{{ book.publish_date ? book.publish_date.slice(0,10) : '' }}</div>
      <div>豆瓣评分：{{ book.douban_score }}</div>
      <div>Bangumi评分：{{ book.bangumi_score }}</div>
    </div>
  </div>
  <div v-else class="empty">未找到该书籍</div>
</template>
<script>
import { getBook } from '@/api/books.api'
export default {
  data() {
    return {
      book: null
    }
  },
  async created() {
    const id = this.$route.params.id
    const res = await getBook(id)
    this.book = res.data.data || null
  }
}
</script>
<style scoped>
.book-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.detail-header {
  display: flex;
  gap: 2rem;
}
.detail-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}
.detail-info {
  flex: 1;
}
.meta {
  color: #888;
  font-size: 0.95em;
  margin: 0.5em 0 1em 0;
  display: flex;
  gap: 1.5em;
}
.desc {
  margin-top: 1em;
  color: #333;
}
.detail-extra {
  margin-top: 2em;
  color: #666;
  font-size: 0.95em;
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
}
.empty {
  color: #aaa;
  text-align: center;
  margin: 2rem 0;
}
</style>