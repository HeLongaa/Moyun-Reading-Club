<template>
  <div class="circle-detail" v-if="group">
    <div class="circle-header">
      <img :src="group.group_icon || defaultIcon" class="circle-icon" />
      <div class="circle-info">
        <h2>{{ group.name }}</h2>
        <p>{{ group.description }}</p>
        <div class="circle-meta">成员数：{{ members.length }}</div>
        <div class="circle-actions">
          <button v-if="!isMember && !pending" @click="joinGroup">加入圈子</button>
          <span v-if="pending">等待审核中</span>
          <button v-if="isMember && !isOwner" @click="quitGroup">退出圈子</button>
          <button v-if="isOwner" @click="goEdit">编辑圈子</button>
          <button v-if="isOwner" @click="deleteGroup" style="background:#e74c3c">删除圈子</button>
          <router-link to="/circle">返回圈子列表</router-link>
          <router-link to="/">返回首页</router-link>
        </div>
      </div>
    </div>
    <member-list :members="members" :is-owner="isOwner" :group-id="group.id" />
    <discussion-list :group-id="group.id" :is-member="isMember" />
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
const members = computed(() => store.getters['circle/members'])
const user = computed(() => store.state.auth.user)
const isOwner = computed(() => group.value && user.value && group.value.founder_id === user.value.id)
const isMember = computed(() => members.value.some(m => m.id === user.value?.id))
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
</script>
<style scoped>
.circle-detail { max-width: 900px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.circle-header { display: flex; align-items: flex-start; margin-bottom: 2rem; }
.circle-icon { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-right: 2rem; }
.circle-info { flex: 1; }
.circle-meta { color: #409eff; margin: 0.5rem 0; }
.circle-actions button { margin-right: 1rem; }
button { background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 0.4rem 1.2rem; cursor: pointer; }
button:disabled { background: #ccc; cursor: not-allowed; }
</style>
