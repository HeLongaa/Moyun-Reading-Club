<template>
  <div class="circle-creator">
    <h2>创建新学习圈</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>圈子名称</label>
        <input
            v-model="form.name"
            required
            placeholder="请输入圈子名称"
        >
      </div>

      <div class="form-group">
        <label>简介</label>
        <textarea
            v-model="form.description"
            required
            placeholder="请输入圈子简介"
            rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label>选择标签</label>
        <div class="tag-selector">
          <button
              v-for="tag in availableTags"
              :key="tag"
              :class="{ active: selectedTags.includes(tag) }"
              @click.prevent="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="primary-btn">
        {{ loading ? '创建中...' : '立即创建' }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        tags: []
      },
      availableTags: ['文学', '科技', '历史', '哲学', '艺术'],
      loading: false
    }
  },

  computed: {
    selectedTags() {
      return this.form.tags
    }
  },

  methods: {
    ...mapActions('circles', ['createCircle']),

    toggleTag(tag) {
      const index = this.form.tags.indexOf(tag)
      if (index === -1) {
        this.form.tags.push(tag)
      } else {
        this.form.tags.splice(index, 1)
      }
    },

    async handleSubmit() {
      this.loading = true
      try {
        const circleData = {
          ...this.form,
          tags: this.form.tags.join(',')
        }
        const newCircle = await this.createCircle(circleData)
        this.$router.push(`/circle/${newCircle.id}`)
      } catch (error) {
        alert('创建失败：' + error.response?.data?.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.tag-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-selector button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}

.tag-selector button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* 复用之前的表单样式 */
</style>