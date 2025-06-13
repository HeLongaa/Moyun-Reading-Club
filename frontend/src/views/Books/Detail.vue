<template>
  <div class="book-detail" :class="{ night: isNight }">
    <div class="book-header">
      <img v-if="book.book_icon" :src="getCoverUrl(book.book_icon)" class="book-cover" alt="封面" />
      <div class="book-title-meta">
        <h2>{{ book.title }}</h2>
        <div class="book-meta">
          <span>作者：{{ book.author }}</span>
          <span>出版社：{{ book.publisher }}</span>
          <span>类型：{{ book.type }}</span>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="book-desc">
        <div class="desc-header">
          <strong>简介：</strong>
          <button class="desc-toggle" @click="descFold = !descFold">{{ descFold ? '展开' : '收起' }}</button>
          <button class="font-btn" @click="fontSize = fontSize + 2">A+</button>
          <button class="font-btn" @click="fontSize = Math.max(14, fontSize - 2)">A-</button>
          <button class="night-btn" @click="isNight = !isNight">{{ isNight ? '日间' : '夜间' }}</button>
        </div>
        <vue3-markdown-it
          v-if="book.description"
          :source="descFold ? shortDesc : book.description"
          :style="{ fontSize: fontSize + 'px', lineHeight: '2', textAlign: 'justify', textIndent: '2em' }"
          class="desc-content"
        />
        <div v-else class="desc-content">暂无简介</div>
      </div>
      <div class="book-actions">
        <router-link :to="`/journal?bookId=${book.id}`">查看书评</router-link>
        <button @click="shareBook">分享</button>
        <router-link to="/books">返回书籍列表</router-link>
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import booksApi from '@/api/books.api'
import Vue3MarkdownIt from 'vue3-markdown-it'

const BASE_URL = process.env.VUE_APP_BASE_API || 'http://localhost:5001/api'

export default {
  name: 'BookDetail',
  components: { Vue3MarkdownIt },
  data() {
    return {
      book: {},
      loading: true,
      error: '',
      descFold: true,
      fontSize: 18,
      isNight: false
    }
  },
  computed: {
    shortDesc() {
      // 简介折叠时只显示前300字
      if (!this.book.description) return ''
      return this.book.description.length > 300
        ? this.book.description.slice(0, 300) + '...'
        : this.book.description
    }
  },
  async created() {
    try {
      const id = this.$route.params.id
      const res = await booksApi.getBookDetail(id)
      this.book = res.data.data || {}
    } catch (e) {
      this.error = '加载失败，请稍后重试'
    } finally {
      this.loading = false
    }
  },
  methods: {
    shareBook() {
      alert('分享功能开发中')
    },
    getCoverUrl(path) {
      if (!path) return require('@/assests/images/moyun.png')
      if (path.startsWith('http')) return path
      return BASE_URL.replace(/\/api$/, '') + path
    }
  }
}
</script>

<style scoped>
.book-detail {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 24px;
  transition: background 0.3s;
}
.book-detail.night {
  background: #232323;
  color: #e0e0e0;
}
.book-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 16px;
}
.book-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  background: #f6f6f6;
}
.book-title-meta {
  flex: 1;
}
.book-meta {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 12px;
  display: flex;
  gap: 24px;
}
.book-desc {
  margin-bottom: 24px;
  color: #22223b;
  font-size: 1.05rem;
  background: rgba(245,245,245,0.7);
  border-radius: 6px;
  padding: 16px 12px;
  transition: background 0.3s;
}
.book-detail.night .book-desc {
  background: #2d2d2d;
  color: #e0e0e0;
}
.desc-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.desc-toggle, .font-btn, .night-btn {
  background: #f2f2f2;
  border: none;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 0.95em;
  cursor: pointer;
  color: #4a4e69;
  transition: background 0.2s;
}
.book-detail.night .desc-toggle, .book-detail.night .font-btn, .book-detail.night .night-btn {
  background: #444;
  color: #e0e0e0;
}
.desc-content {
  min-height: 80px;
  word-break: break-all;
  line-height: 2;
  text-align: justify;
  text-indent: 2em;
  transition: color 0.3s;
}
.book-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}
.book-actions button {
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
}
@media (max-width: 600px) {
  .book-detail {
    padding: 12px 2vw;
  }
  .book-header {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .book-cover {
    width: 90px;
    height: 120px;
  }
  .book-title-meta {
    width: 100%;
    text-align: center;
  }
  .book-meta {
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }
  .book-desc {
    font-size: 0.98rem;
    padding: 10px 4px;
  }
}
</style>