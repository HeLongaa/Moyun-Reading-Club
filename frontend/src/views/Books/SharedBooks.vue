<template>
  <MainLayout>
    <div class="shared-books-view">
      <h2>共享书籍库</h2>

      <BookList
          :books="sharedBooks"
          :show-share-button="false"
          class="book-grid"
      />
    </div>
  </MainLayout>
</template>

<script>
import { mapState } from 'vuex'
import BookList from '@/components/books/BookList.vue'

export default {
  components: {
    BookList
  },

  computed: {
    ...mapState('books', ['sharedBooks'])
  },

  async created() {
    await this.$store.dispatch('books/fetchSharedBooks')
  }
}
</script>

<style lang="scss" scoped>
.book-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>