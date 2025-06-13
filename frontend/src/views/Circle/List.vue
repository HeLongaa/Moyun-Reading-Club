<template>
  <div class="circle-list">
    <h2>圈子列表</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="circle in circles" :key="circle.id" class="circle-item">
        <img
          class="circle-icon"
          :src="getIconUrl(circle.icon)"
          alt="圈子图标"
          @error="onImgError($event)"
        />
        <div class="circle-title">{{ circle.name }}</div>
        <div class="circle-desc">{{ circle.description }}</div>
        <div class="circle-meta">成员数：{{ circle.member_count || circle.memberCount || 0 }}</div>
        <button @click="viewDetail(circle.id)">查看详情</button>
      </li>
    </ul>
  </div>
</template>

<script>
import circlesApi from '@/api/circles.api'

export default {
  name: 'CircleList',
  data() {
    return {
      loading: true,
      circles: [],
      error: ''
    }
  },
  async created() {
    try {
      const res = await circlesApi.getGroups()
      // 兼容后端返回结构
      if (res && res.data && Array.isArray(res.data.groups)) {
        this.circles = res.data.groups
      } else if (res && res.data && Array.isArray(res.data.data?.groups)) {
        this.circles = res.data.data.groups
      } else {
        this.circles = []
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('加载圈子失败:', e, e?.response)
      if (e?.response?.data?.error) {
        this.error = e.response.data.error
      } else if (e?.message) {
        this.error = e.message
      } else {
        this.error = '加载失败，请稍后重试'
      }
    } finally {
      this.loading = false
    }
  },
  methods: {
    viewDetail(id) {
      this.$router.push({ name: 'CircleDetail', params: { id } })
    },
    getIconUrl(icon) {
      const BASE_URL = process.env.VUE_APP_BASE_API || 'http://localhost:5001/api'
      if (!icon) return require('@/assests/images/default.png')
      if (icon.startsWith('http')) return icon
      return BASE_URL.replace(/\/api$/, '') + icon
    },
    onImgError(e) {
      e.target.src = require('@/assests/images/default.png')
    }
  }
}
</script>

<style scoped>
.circle-list {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 24px;
}
.loading {
  text-align: center;
  color: #888;
  margin: 32px 0;
}
.error {
  color: #e63946;
  text-align: center;
  margin: 32px 0;
}
.circle-item {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.circle-icon {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f6f6f6;
}
.circle-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #22223b;
}
.circle-desc {
  color: #888;
  font-size: 0.98rem;
}
.circle-meta {
  color: #409eff;
  font-size: 0.95rem;
}
.circle-item button {
  align-self: flex-start;
  margin-top: 8px;
  padding: 4px 16px;
  border: none;
  border-radius: 4px;
  background: #4a4e69;
  color: #fff;
  cursor: pointer;
}
</style>
