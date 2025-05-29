<template>
  <div class="shared-books">
    <h2>共享图书</h2>
    
    <el-table :data="books" style="width: 100%">
      <el-table-column prop="title" label="书名" />
      <el-table-column prop="author" label="作者" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button 
            size="mini" 
            type="danger"
            @click="handleUnshare(row.id)"
          >
            取消共享
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SharedBooks',
  
  data() {
    return {
      books: [],
      loading: false
    }
  },
  
  computed: {
    ...mapState('circles', ['currentCircle'])
  },
  
  created() {
    this.fetchSharedBooks()
  },
  
  methods: {
    ...mapActions('books', ['getSharedBooks', 'unshareBook']),
    
    async fetchSharedBooks() {
      this.loading = true
      try {
        const res = await this.getSharedBooks(this.currentCircle.id)
        this.books = res.data
      } finally {
        this.loading = false
      }
    },
    
    async handleUnshare(bookId) {
      await this.unshareBook({
        bookId,
        circleId: this.currentCircle.id
      })
      this.$message.success('已取消共享')
      this.fetchSharedBooks()
    }
  }
}
</script>

<style scoped>
.shared-books {
  padding: 20px;
}
</style>