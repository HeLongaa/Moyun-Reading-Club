<template>
  <div class="book-searcher">
    <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="搜索书名/作者/关键词..."
        class="search-input"
    />

    <button @click="onSearch">搜索</button>

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
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'search'],
  data() {
    return {
      searchQuery: this.modelValue || '',
      results: [],
      timeoutId: null
    };
  },
  watch: {
    modelValue(val) {
      this.searchQuery = val
    }
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
    },
    onSearch() {
      this.$emit('update:modelValue', this.searchQuery)
      this.$emit('search', this.searchQuery)
    }
  }
};
</script>

<style scoped>
.book-searcher {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>