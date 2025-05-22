<template>
  <div class="circle-join">
    <h2>选择导师加入学习圈</h2>
    <div v-if="availableCircles.length === 0" class="empty-tip">
      暂无可用学习圈，请稍后再来
    </div>

    <div v-else class="circle-list">
      <div
          v-for="circle in availableCircles"
          :key="circle.id"
          class="circle-card"
          :class="{ selected: selectedCircle === circle.id }"
          @click="selectedCircle = circle.id"
      >
        <div class="mentor-info">
          <img :src="circle.mentor.avatar" class="avatar">
          <div class="mentor-details">
            <h3>{{ circle.mentor.name }}</h3>
            <p class="bio">{{ circle.mentor.bio }}</p>
          </div>
        </div>

        <div class="circle-details">
          <h4>{{ circle.name }}</h4>
          <p class="members">成员：{{ circle.memberCount }}人</p>
          <div class="tags">
            <span v-for="tag in circle.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <button
        class="join-btn"
        :disabled="!selectedCircle || joining"
        @click="handleJoin"
    >
      {{ joining ? '正在加入...' : '立即加入' }}
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      selectedCircle: null,
      joining: false
    }
  },

  computed: {
    ...mapState('circles', ['availableCircles'])
  },

  async created() {
    await this.fetchAvailableCircles()
  },

  methods: {
    ...mapActions('circles', ['joinCircle', 'fetchAvailableCircles']),

    async handleJoin() {
      this.joining = true
      try {
        await this.joinCircle(this.selectedCircle)
        this.$router.push(`/circle/${this.selectedCircle}`)
      } catch (error) {
        alert('加入失败：' + error.response?.data?.message)
      } finally {
        this.joining = false
      }
    }
  }
}
</script>

<style scoped>
.circle-list {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
}

.circle-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.circle-card.selected {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.mentor-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.bio {
  color: #666;
  font-size: 0.9em;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8em;
}

.join-btn {
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.join-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}
</style>