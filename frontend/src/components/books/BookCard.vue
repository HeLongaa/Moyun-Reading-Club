<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "BookCard.vue",
  props: {
    book: { type: Object, required: true }
  },
  computed: {
    coverUrl() {
      return this.book.book_icon || '/bookCover/default.png'
    }
  }
})
</script>

<template>
  <div class="book-card" @click="$emit('click')">
    <img :src="coverUrl" class="book-cover" alt="封面" />
    <div class="book-info">
      <h3>{{ book.title }}</h3>
      <div class="book-meta">
        <span>{{ book.author }}</span>
        <span>{{ book.publisher }}</span>
      </div>
      <div class="book-type">{{ book.type }}</div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  gap: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow .2s;
}
.book-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.book-cover {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}
.book-info {
  flex: 1;
}
.book-meta {
  color: #888;
  font-size: 0.9em;
  margin: 0.5em 0;
}
.book-type {
  color: #409eff;
  font-size: 0.9em;
}
</style>