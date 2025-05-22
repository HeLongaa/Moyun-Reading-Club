<template>
  <div class="book-list">
    <div class="controls">
      <BookSearch @search="handleSearch" />
      <FilterPanel @filter="applyFilters" />
    </div>

    <div class="books-grid">
      <BookCard
          v-for="book in displayedBooks"
          :key="book.id"
          :book="book"
          @share="showSharePanel(book)"
      />
    </div>

    <Pagination
        :current="currentPage"
        :total="totalPages"
        @change="changePage"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      currentPage: 1,
      filters: {},
      searchQuery: ''
    }
  },

  computed: {
    ...mapState('books', ['bookList', 'searchResults']),
    displayedBooks() {
      return this.searchQuery ? this.searchResults : this.bookList
    },
    totalPages() {
      return Math.ceil(this.displayedBooks.length / 20)
    }
  },

  async created() {
    await this.fetchBooks()
    await this.loadRecommendations()
  },

  methods: {
    ...mapActions('books', ['fetchBooks', 'searchBooks', 'loadRecommendations']),

    handleSearch(query) {
      this.searchQuery = query
      this.searchBooks(query)
    },

    applyFilters(filters) {
      this.filters = filters
      this.fetchBooks({
        ...filters,
        page: this.currentPage
      })
    },

    changePage(page) {
      this.currentPage = page
      window.scrollTo(0, 0)
    },

    showSharePanel(book) {
      this.$modal.show('share-modal', { book })
    }
  }
}
</script>

<style scoped>
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>