<template>
  <Modal name="share-modal" @close="reset">
    <template #header>
      <h2>分享《{{ currentBook.title }}》</h2>
    </template>

    <div class="share-content">
      <div v-if="isStudent" class="student-share">
        <p>已自动分享到你的学习圈：</p>
        <CirclePreview :circle="userCircle" />
      </div>

      <div v-else class="mentor-share">
        <label>选择分享的圈子：</label>
        <select v-model="selectedCircles" multiple>
          <option
              v-for="circle in myCircles"
              :key="circle.id"
              :value="circle.id"
          >
            {{ circle.name }}（{{ circle.memberCount }}人）
          </option>
        </select>
      </div>
    </div>

    <template #footer>
      <button @click="confirmShare" :disabled="sharing">
        {{ sharing ? '分享中...' : '确认分享' }}
      </button>
    </template>
  </Modal>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      currentBook: null,
      selectedCircles: [],
      sharing: false
    }
  },

  computed: {
    ...mapState({
      myCircles: state => state.circles.myCircles,
      user: state => state.auth.user
    }),
    isStudent() {
      return this.user.role === 'student'
    },
    userCircle() {
      return this.myCircles.find(c => c.id === this.user.joinedCircle)
    }
  },

  methods: {
    ...mapActions('books', ['shareBook']),

    reset() {
      this.currentBook = null
      this.selectedCircles = []
      this.sharing = false
    },

    async confirmShare() {
      this.sharing = true
      try {
        const circles = this.isStudent ? [this.user.joinedCircle] : this.selectedCircles
        await Promise.all(
            circles.map(circleId =>
                this.shareBook({
                  bookId: this.currentBook.id,
                  circleId
                })
            )
        )
        this.$toast.success('分享成功！')
        this.$modal.hide('share-modal')
      } catch (error) {
        this.$toast.error('部分分享失败')
      } finally {
        this.sharing = false
      }
    }
  },

  mounted() {
    this.$modal.listen('share-modal', (event, { book }) => {
      this.currentBook = book
      if (this.isStudent) {
        this.selectedCircles = [this.user.joinedCircle]
      }
    })
  }
}
</script>

<style scoped>
.share-content {
  padding: 1.5rem;
  min-height: 200px;
}

.student-share {
  text-align: center;
}

.mentor-share select {
  width: 100%;
  height: 120px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>