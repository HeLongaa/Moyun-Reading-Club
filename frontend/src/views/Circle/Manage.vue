<template>
  <div class="circle-manage">
    <h2>圈子管理</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <div v-else>
      <table class="circle-table">
        <thead>
          <tr>
            <th>圈子名称</th>
            <th>简介</th>
            <th>成员数</th>
            <th>讨论数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in circles" :key="g.id">
            <td>{{ g.name }}</td>
            <td>{{ g.description }}</td>
            <td>{{ g.memberCount || g.member_count }}</td>
            <td>{{ g.discussionCount || g.discussion_count }}</td>
            <td>
              <button @click="goDetail(g.id)">详情</button>
              <button @click="goEdit(g.id)">编辑</button>
              <button @click="goReview(g.id)">成员审核</button>
              <button @click="delGroup(g.id)" class="danger-btn">删除</button>
            </td>
          </tr>
          <tr v-if="!circles.length">
            <td colspan="5" class="empty-tip">暂无圈子</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import circlesApi from '@/api/circles.api'
export default {
  name: 'CircleManage',
  data() {
    return {
      loading: true,
      error: '',
      circles: []
    }
  },
  async created() {
    try {
      // 只请求 /group，不拼接 /manage
      const res = await circlesApi.getGroups()
      let groups = []
      if (res.data && res.data.data && Array.isArray(res.data.data.groups)) {
        groups = res.data.data.groups
      } else if (res.data && Array.isArray(res.data.groups)) {
        groups = res.data.groups
      } else {
        groups = []
      }
      const userId = this.$store.state.auth.user?.id
      this.circles = groups.filter(g => g.founder_id === userId)
    } catch (e) {
      this.error = e?.response?.data?.error || e?.message || '加载失败'
    } finally {
      this.loading = false
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push(`/circle/${id}`)
    },
    goEdit(id) {
      this.$router.push(`/circle/edit/${id}`)
    },
    goReview(id) {
      this.$router.push(`/circle/${id}/review`)
    },
    async delGroup(id) {
      if (!confirm('确定要删除该圈子吗？')) return
      try {
        await circlesApi.deleteGroup(id)
        this.circles = this.circles.filter(g => g.id !== id)
      } catch (e) {
        alert(e?.response?.data?.error || e?.message || '删除失败')
      }
    }
  }
}
</script>
<style scoped>
.circle-manage {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.circle-table {
  width: 100%;
  border-collapse: collapse;
}
.circle-table th, .circle-table td {
  border: 1px solid #eee;
  padding: 0.7rem 0.5rem;
  text-align: left;
}
.circle-table th {
  background: #f7f9fa;
}
.danger-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  margin-left: 8px;
  cursor: pointer;
}
.danger-btn:hover {
  background: #c0392b;
}
.loading, .error-tip, .empty-tip {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.error-tip { color: #e74c3c; }
</style>
.loading, .error-tip, .empty-tip {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.error-tip { color: #e74c3c; }

