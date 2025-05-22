<template>
  <div class="recommendations">
    <h2>为您推荐</h2>

    <div class="filter-bar">
      <select v-model="filters.category">
        <option value="">所有分类</option>
        <option v-for="category in categories"
                :key="category"
                :value="category">
          {{ category }}
        </option>
      </select>

      <div class="rating-filter">
        <label>最低评分：</label>
        <input type="range" min="0" max="5" v-model="filters.minRating">
        {{ filters.minRating }}
      </div>
    </div>

    <div class="book-list">
      <BookCard
          v-for="book in recommendations"
          :key="book.id"
          :book="book"
      />

      <div v-if="loading" class="loading">
        加载中...
      </div>
    </div>

    <div class="pagination">
      <button
          @click="prevPage"
          :disabled="currentPage === 1">
        上一页
      </button>

      <span>第 {{ currentPage }} 页</span>

      <button
          @click="nextPage"
          :disabled="currentPage === totalPages">
        下一页
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      totalPages: 1,
      filters: {
        category: '',
        minRating: 0
      },
      loading: false
    };
  },
  computed: {
    recommendations() {
      return this.$store.getters['books/recommendedBooks'];
    },
    categories() {
      return this.$store.state.books.categories;
    }
  },
  methods: {
    async loadRecommendations() {
      this.loading = true;
      try {
        await this.$store.dispatch('books/fetchRecommendedBooks', {
          page: this.currentPage,
          ...this.filters
        });
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadRecommendations();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadRecommendations();
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1;
        this.loadRecommendations();
      }
    }
  },
  created() {
    this.loadRecommendations();
  }
};
</script>