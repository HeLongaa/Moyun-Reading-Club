<template>
  <div class="circle-detail" v-if="group">
    <div class="circle-header">
      <!-- 圈子图标可选 -->
      <div class="circle-info">
        <h2 class="circle-title">{{ group.name }}</h2>
        <div class="circle-meta">
          <span class="circle-founder">圈主：{{ group.founder_name || group.founder?.account || group.founder_id }}</span>
          <span>成员数：{{ members.length }}</span>
        </div>
        <p class="circle-desc">{{ group.description }}</p>
        <div class="circle-actions">
          <button v-if="!isMember && !pending" class="circle-btn" @click="joinGroup">加入圈子</button>
          <span v-if="pending" class="pending-tip">等待审核中</span>
          <button v-if="isMember && !isOwner" class="circle-btn" @click="quitGroup">退出圈子</button>
          <button v-if="isOwner" class="circle-btn" @click="goEdit">编辑圈子</button>
          <button v-if="isOwner" class="circle-btn danger-btn" @click="deleteGroup">删除圈子</button>
          <button v-if="isOwner" class="circle-btn" @click="goReview">成员审核</button>
          <button v-if="isOwner" class="circle-btn" @click="goSettings">设置</button>
          <button class="circle-btn" @click="goCircleList">返回圈子列表</button>
          <button class="circle-btn" @click="goHome">返回首页</button>
        </div>
      </div>
    </div>
    <div class="circle-section">
      <member-list :members="members" :is-owner="isOwner" :group-id="group.id" />
    </div>
    <div class="circle-section">
      <discussion-list :group-id="group.id" :is-member="isMember" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import MemberList from '@/components/circles/MemberList.vue'
import DiscussionList from '@/components/circles/DiscussionList.vue'
const store = useStore()
const route = useRoute()
const router = useRouter()
const defaultIcon = '/static/groupIcon/default.png'
const group = computed(() => store.getters['circle/groupDetail'])
const members = computed(() => {
  const arr = store.getters['circle/members']
  return Array.isArray(arr) ? arr : []
})
const user = computed(() => store.state.auth.user)
const isOwner = computed(() => group.value && user.value && group.value.founder_id === user.value.id)
const isMember = computed(() => {
  const arr = Array.isArray(members.value) ? members.value : []
  return arr.some(m => m.id === user.value?.id)
})
const pending = ref(false)
const fetchAll = async () => {
  await store.dispatch('circle/fetchGroupDetail', route.params.id)
  await store.dispatch('circle/fetchMembers', route.params.id)
}
onMounted(fetchAll)
const joinGroup = async () => {
  try {
    await store.dispatch('circle/joinGroup', group.value.id)
    pending.value = true
  } catch (e) { alert('加入失败') }
}
const quitGroup = async () => {
  try {
    await store.dispatch('circle/quitGroup', group.value.id)
    router.push('/circle')
  } catch (e) { alert('退出失败') }
}
const goEdit = () => router.push(`/circle/edit/${group.value.id}`)
const deleteGroup = async () => {
  if (confirm('确定删除该圈子？')) {
    await store.dispatch('circle/deleteGroup', group.value.id)
    router.push('/circle')
  }
}
const goReview = () => router.push(`/circle/${group.value.id}/review`)
const goSettings = () => router.push(`/circle/${group.value.id}/settings`)
const goCircleList = () => router.push('/circle')
const goHome = () => router.push('/')
</script>
<style scoped>
.circle-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  padding: 2rem;
}
.circle-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}
.circle-info {
  flex: 1;
}
.circle-title {
  font-size: 2rem;
  font-weight: bold;
  color: #22223b;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}
.circle-meta {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1.5rem;
}
.circle-founder {
  color: #409eff;
}
.circle-desc {
  margin-bottom: 1.2rem;
  font-size: 1.08rem;
  color: #22223b;
}
.circle-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.circle-btn {
  background: linear-gradient(90deg,#409eff 60%,#6a82fb 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px #e0e7ff;
  transition: background 0.2s, box-shadow 0.2s;
}
.circle-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.circle-btn:hover:not(:disabled) {
  background: #337ecc;
}
.danger-btn {
  background: #e74c3c !important;
}
.pending-tip {
  color: #e67e22;
  font-weight: bold;
}
.circle-link {
  color: #409eff;
  text-decoration: underline;
  font-size: 1rem;
  margin-right: 0.5rem;
}
.circle-section {
  margin-top: 2rem;
}
@media (max-width: 800px) {
  .circle-detail { padding: 1rem; }
  .circle-header { flex-direction: column; gap: 1rem; }
}
</style>
