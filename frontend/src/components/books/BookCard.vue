<template>
  <div class="book-card" @click="$emit('click')">
    <div class="book-title">{{ book.title }}</div>
    <div class="book-author">{{ book.author }}</div>
    <div class="book-type">{{ book.type }}</div>
    <!-- 可补充更多字段 -->
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: { type: Object, required: true }
  }
}
</script>

<style scoped>
.book-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  padding: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
}
.book-title { font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem; }
.book-author, .book-type { color: #888; font-size: 0.95rem; }
</style>