<script>
import booksApi from '@/api/books.api'
import BookList from '@/components/books/BookList.vue'
import BookSearcher from '@/components/books/BookSearcher.vue'

export default {
  name: "Explore",
  components: { BookList, BookSearcher },
  data() {
    return {
      books: [],
      types: [],
      type: '',
      search: '',
      page: 1,
      limit: 10,
      total: 0
    }
  },
  computed: {
    hasMore() {
      return this.page * this.limit < this.total
    }
  },
  async created() {
    await this.fetchTypes()
    await this.fetchBooks()
  },
  methods: {
    async fetchTypes() {
      const res = await booksApi.getBookTypes()
      this.types = (res.data && res.data.data) ? res.data.data : []
    },
    async fetchBooks() {
      const params = {
        page: this.page,
        limit: this.limit,
        type: this.type,
        search: this.search
      }
      const res = await booksApi.getBooks(params)
      // 修正：兼容 res.data.data.books 或 res.data.books
      let books = []
      let total = 0
      if (res.data && res.data.data) {
        books = res.data.data.books || []
        total = res.data.data.total || 0
      } else if (res.data) {
        books = res.data.books || []
        total = res.data.total || 0
      }
      this.books = books
      this.total = total
    },
    goDetail(book) {
      this.$router.push(`/books/${book.id}`)
    }
  }
}
</script>

<template>
  <div class="books-explore">
    <div class="explore-header">
      <BookSearcher v-model="search" @search="fetchBooks" />
      <select v-model="type" @change="fetchBooks">
        <option value="">全部类型</option>
        <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
    <BookList :books="books" @select="goDetail" />
    <div class="pagination">
      <button :disabled="page===1" @click="page-- && fetchBooks()">上一页</button>
      <span>第{{ page }}页</span>
      <button :disabled="!hasMore" @click="page++ && fetchBooks()">下一页</button>
    </div>
  </div>
</template>

<style scoped>
.explore-books {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.explore-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
</style>