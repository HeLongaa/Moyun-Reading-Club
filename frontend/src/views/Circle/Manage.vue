<template>
  <div class="circle-bg">
    <div class="page-header">
      <img class="page-logo" src="@/assests/images/logo.png" alt="logo" />
      <div class="nav-btns">
        <router-link to="/">首页</router-link>
        <router-link to="/books">书籍</router-link>
        <router-link to="/journal">书评</router-link>
        <router-link to="/circle">圈子</router-link>
        <router-link to="/profile">我的</router-link>
        <router-link to="/search">搜索</router-link>
      </div>
    </div>
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
                <button class="action-btn" @click="goDetail(g.id)">详情</button>
                <button class="action-btn" @click="goEdit(g.id)">编辑</button>
                <button class="action-btn" @click="goReview(g.id)">成员审核</button>
                <button class="danger-btn" @click="delGroup(g.id)">删除</button>
              </td>
            </tr>
            <tr v-if="!circles.length">
              <td colspan="5" class="empty-tip">暂无圈子</td>
            </tr>
          </tbody>
        </table>
      </div>
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
.circle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  background: url('@/assests/images/moyun.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
}
.page-header {
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  align-items: center;
  z-index: 20;
}
.page-logo {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px #eee;
  object-fit: cover;
  border: 2px solid #e0e7ff;
  margin-right: 18px;
}
.nav-btns {
  display: flex;
  gap: 18px;
}
.nav-btns a {
  color: #409eff;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.85);
  transition: background 0.2s, color 0.2s;
}
.nav-btns a:hover {
  background: #409eff;
  color: #fff;
}
.circle-manage {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  background: rgba(255,255,255,0.97);
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(64,158,255,0.13);
  padding: 2.5rem 2.5rem 3.5rem 2.5rem;
  min-height: 60vh;
}
.circle-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px #e0e7ff;
}
.circle-table th, .circle-table td {
  padding: 1rem 0.7rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}
.circle-table th {
  background: #f3f4f6;
  color: #409eff;
  font-weight: 700;
}
.circle-table tr:last-child td {
  border-bottom: none;
}
.action-btn {
  color: #409eff;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  margin-right: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.action-btn:hover {
  background: #409eff;
  color: #fff;
}
.danger-btn {
  color: #fff;
  background: #e74c3c;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.danger-btn:hover {
  background: #c0392b;
}
.empty-tip {
  text-align: center;
  color: #888;
  padding: 1.5rem 0;
}
.loading {
  text-align: center;
  color: #409eff;
  font-size: 1.2rem;
  margin: 2rem 0;
}
.error-tip {
  color: #e74c3c;
  text-align: center;
  margin: 2rem 0;
  font-size: 1.1rem;
}
</style>

