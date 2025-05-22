<template>
  <MainLayout>
    <div class="book-detail">
      <div class="book-header">
        <img :src="book.cover" class="book-cover" alt="封面">
        <div class="book-info">
          <h1>{{ book.title }}</h1>
          <p class="author">作者：{{ book.author }}</p>
          <div class="meta">
            <span class="publisher">出版社：{{ book.publisher }}</span>
            <span class="isbn">ISBN：{{ book.isbn }}</span>
          </div>
          <ShareButton :book="book" />
        </div>
      </div>

      <div class="book-content">
        <Tabs>
          <Tab title="简介">
            <div class="description">{{ book.description }}</div>
          </Tab>
          <Tab title="书评">
            <CommentSection :targetId="book.id" targetType="book" />
          </Tab>
          <Tab title="相关圈子">
            <CircleList :circles="relatedCircles" />
          </Tab>
        </Tabs>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: ['id'],

  computed: {
    ...mapState('books', ['currentBook']),
    book() {
      return this.currentBook || {}
    },
    relatedCircles() {
      return this.$store.state.circles.availableCircles.filter(
          c => c.tags.some(t => this.book.tags.includes(t))
      )
    }
  },

  async created() {
    await this.fetchBookDetail(this.id)
  },

  methods: {
    ...mapActions('books', ['fetchBookDetail'])
  }
}
</script>

<style scoped>
.book-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.book-cover {
  width: 240px;
  height: 320px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.book-info {
  flex: 1;
}

.author {
  font-size: 1.2em;
  color: #666;
  margin: 0.5rem 0;
}

.meta {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  color: #888;
}

.book-content {
  margin-top: 2rem;
}

.description {
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>