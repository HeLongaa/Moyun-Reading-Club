<template>
  <div class="circle-list">
    <h2>圈子列表</h2>
    <div v-if="isTeacherOrAdmin" style="margin-bottom: 1em;">
      <button @click="createCircle">创建圈子</button>
      <label style="margin-left:1em;">
        <input type="checkbox" v-model="showMine" />
        只看我管理的圈子
      </label>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="circle in filteredCircles" :key="circle.id" class="circle-item">
        <div class="circle-title">{{ circle.name }}</div>
        <div class="circle-desc">{{ circle.description }}</div>
        <div class="circle-meta">成员数：{{ circle.memberCount || circle.member_count || 0 }}</div>
        <button @click="viewDetail(circle.id)">查看详情</button>
        <button v-if="isTeacherOrAdmin && circle.founder_id === myId" @click="editCircle(circle.id)">管理</button>
        <button v-if="isTeacherOrAdmin && circle.founder_id === myId" @click="reviewCircle(circle.id)">成员审核</button>
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
      error: '',
      showMine: false
    }
  },
  computed: {
    myId() {
      return this.$store.state.auth?.user?.id
    },
    myRole() {
      return this.$store.state.auth?.user?.role
    },
    isTeacherOrAdmin() {
      return this.myRole === 'teacher' || this.myRole === 'admin'
    },
    filteredCircles() {
      if (!this.isTeacherOrAdmin || !this.showMine) return this.circles
      return this.circles.filter(c => c.founder_id === this.myId)
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
    editCircle(id) {
      this.$router.push({ name: 'CircleEdit', params: { id } })
    },
    createCircle() {
      this.$router.push({ name: 'CircleEdit', params: { id: 'new' } })
    },
    reviewCircle(id) {
      this.$router.push({ name: 'CircleSettings', params: { id } })
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
