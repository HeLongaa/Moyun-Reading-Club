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
    <div class="circle-member-review">
      <h2 class="review-title">待审核成员列表</h2>
      <div v-if="error" class="error-tip">{{ error }}</div>
      <div v-if="loading" class="loading">加载中...</div>
      <ul v-else>
        <li v-for="m in pendingMembers" :key="m.user_id" class="member-item">
          <img class="member-avatar" :src="m.user?.avatar || require('@/assests/images/logo.png')" alt="头像" />
          <span class="member-name">{{ m.user?.account || m.user_id }}</span>
          <button class="action-btn" @click="review(m.user_id, true)">同意</button>
          <button class="danger-btn" @click="review(m.user_id, false)">拒绝</button>
        </li>
        <li v-if="!pendingMembers.length && !error && !loading" class="empty-tip">暂无待审核成员</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import circlesApi from '@/api/circles.api'

const route = useRoute()
const groupId = route.params.id
const pendingMembers = ref([])
const error = ref('')
const loading = ref(false)

async function fetchMembers() {
  error.value = ''
  loading.value = true
  try {
    const res = await circlesApi.getPendingMembers(groupId)
    if (res.success) {
      // 兼容返回数组或 data 字段
      pendingMembers.value = Array.isArray(res.data) ? res.data : (res.data?.pendingMembers || res.data || [])
    } else {
      error.value = res.error || '加载失败'
      pendingMembers.value = []
    }
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || '请求失败'
    pendingMembers.value = []
  } finally {
    loading.value = false
  }
}

async function review(userId, isOno) {
  try {
    await circlesApi.reviewMember(groupId, userId, { isOno })
    await fetchMembers()
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || '操作失败'
  }
}

onMounted(fetchMembers)
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
.circle-member-review {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  background: rgba(255,255,255,0.97);
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(64,158,255,0.18);
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  min-height: 40vh;
  transition: box-shadow 0.3s;
}
.review-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2563eb;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px #e0e7ff;
}
.member-item {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  font-size: 1.1rem;
  border-bottom: 2px solid #e0e7ff;
  padding-bottom: 14px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e0e7ff33;
  transition: box-shadow 0.2s, background 0.2s;
}
.member-item:last-child {
  border-bottom: none;
}
.member-item:hover {
  box-shadow: 0 6px 18px #b3c6ff66;
  background: #f0f7ff;
}
.member-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 18px;
  border: 2px solid #e0e7ff;
  background: #fff;
}
.member-name {
  flex: 1;
  color: #22223b;
  font-weight: 500;
}
.action-btn {
  color: #409eff;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  margin-right: 8px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 4px #e0e7ff;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.action-btn:hover {
  background: #409eff;
  color: #fff;
  transform: translateY(-2px) scale(1.05);
}
.danger-btn {
  color: #fff;
  background: #e74c3c;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 4px #fbb;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.danger-btn:hover {
  background: #c0392b;
  transform: translateY(-2px) scale(1.05);
}
.empty-tip {
  text-align: center;
  color: #2563eb;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 2rem 0;
  letter-spacing: 1px;
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
  font-weight: bold;
}
</style>
