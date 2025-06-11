<template>
  <div class="circle-list">
    <div class="header">
      <input v-model="search" placeholder="搜索圈子..." @keyup.enter="fetchGroups" />
      <button v-if="canCreate" @click="goCreate">新建圈子</button>
    </div>
    <div class="circles">
      <div v-for="g in groups" :key="g.id" class="circle-card" @click="goDetail(g.id)">
        <img :src="g.icon || defaultIcon" class="circle-icon" />
        <div class="circle-info">
          <div class="circle-name">{{ g.name }}</div>
          <div class="circle-desc">{{ g.description }}</div>
          <div class="circle-meta">成员数：{{ g.memberCount || (g.members?.length || '-') }}</div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button :disabled="page===1" @click="page-- && fetchGroups()">上一页</button>
      <span>第{{ page }}页</span>
      <button :disabled="groups.length<limit" @click="page++ && fetchGroups()">下一页</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const search = ref('')
const page = ref(1)
const limit = 10
const defaultIcon = '/static/groupIcon/default.png'
const groups = computed(() => store.getters['circle/groups'])
const canCreate = computed(() => store.state.auth.user?.role === 'teacher' || store.state.auth.user?.role === 'admin')
const fetchGroups = () => {
  store.dispatch('circle/fetchGroups', { page: page.value, limit, search: search.value })
}
onMounted(fetchGroups)
const goCreate = () => router.push('/circle/create')
const goDetail = id => router.push(`/circle/${id}`)
</script>
<style scoped>
.circle-list { max-width: 900px; margin: 2rem auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.circles { display: flex; flex-wrap: wrap; gap: 1rem; }
.circle-card { width: 260px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 1rem; cursor: pointer; display: flex; }
.circle-icon { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 1rem; }
.circle-info { flex: 1; }
.circle-name { font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem; }
.circle-desc { color: #888; font-size: 0.95rem; margin-bottom: 0.5rem; }
.circle-meta { color: #409eff; font-size: 0.9rem; }
.pagination { margin: 1.5rem 0; text-align: center; }
button { background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 0.4rem 1.2rem; cursor: pointer; }
button:disabled { background: #ccc; cursor: not-allowed; }
</style>
