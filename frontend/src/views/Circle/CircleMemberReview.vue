<template>
  <div class="circle-member-review">
    <h2>待审核成员列表</h2>
    <div v-if="error" style="color:red">{{ error }}</div>
    <div v-if="loading">加载中...</div>
    <ul v-else>
      <li v-for="m in pendingMembers" :key="m.user_id" class="member-item">
        {{ m.user?.account || m.user_id }}
        <button @click="review(m.user_id, true)">同意</button>
        <button @click="review(m.user_id, false)">拒绝</button>
      </li>
      <li v-if="!pendingMembers.length && !error && !loading">暂无待审核成员</li>
    </ul>
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
.circle-member-review { padding: 24px; }
.member-item { margin-bottom: 12px; }
button { margin-left: 8px; }
</style>
