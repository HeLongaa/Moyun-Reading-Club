<template>
  <div class="search-bar">
    <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="搜索书籍..."
        class="search-input"
    />

    <div v-if="results.length > 0" class="search-results">
      <BookCard
          v-for="book in results"
          :key="book.id"
          :book="book"
          small
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      results: [],
      timeoutId: null
    };
  },
  methods: {
    handleSearch() {
      if (this.timeoutId) clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(async () => {
        if (this.searchQuery.trim().length < 2) {
          this.results = [];
          return;
        }

        const results = await this.$store.dispatch(
            'books/searchBooks',
            this.searchQuery
        );
        this.results = results.slice(0, 5);
      }, 300);
    }
  }
};
</script>