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
    <div class="circle-edit" v-if="form">
      <h2>{{ isCreate ? '创建圈子' : '编辑圈子' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group"><label>圈子名</label><input v-model="form.name" required /></div>
        <div class="form-group"><label>简介</label><textarea v-model="form.description" required /></div>
        <div class="form-group"><label>圈子图标</label><input type="file" @change="onIconFile" /></div>
        <button type="submit" :disabled="loading">{{ loading ? '提交中...' : (isCreate ? '创建' : '提交') }}</button>
        <button type="button" @click="cancel">取消</button>
        <div v-if="error" class="error-msg">{{ error }}</div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import circlesApi from '@/api/circles.api'
const route = useRoute()
const router = useRouter()
const isCreate = computed(() => route.params.id === 'new')
const form = ref({ name: '', description: '' })
const loading = ref(false)
const error = ref('')
const iconFile = ref(null)

onMounted(async () => {
  if (!isCreate.value) {
    const res = await circlesApi.getGroupDetail(route.params.id)
    if (res.success) {
      form.value = { name: res.data.name, description: res.data.description, icon: res.data.icon }
    }
  }
})

const onIconFile = e => { iconFile.value = e.target.files[0] }
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    let group
    if (isCreate.value) {
      const res = await circlesApi.createGroup({ name: form.value.name, description: form.value.description })
      if (res.success) {
        group = res.data
        // 上传图标
        if (iconFile.value) {
          const fd = new FormData()
          fd.append('icon', iconFile.value)
          await circlesApi.uploadGroupIcon(group.id, fd)
        }
        router.push({ name: 'CircleDetail', params: { id: group.id } })
      } else {
        error.value = res.error || '创建失败'
      }
    } else {
      await circlesApi.editGroup(route.params.id, { name: form.value.name, description: form.value.description })
      if (iconFile.value) {
        await circlesApi.uploadGroupIcon(route.params.id, iconFile.value)
      }
      router.push(`/circle/${route.params.id}`)
    }
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || '操作失败'
  } finally {
    loading.value = false
  }
}
const cancel = () => router.back()
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
.circle-edit {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 2rem;
}
.form-group { margin-bottom: 1rem; }
input, textarea { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { margin-top: 0.5rem; padding: 0.5rem 1.5rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
.error-msg { color: #e74c3c; margin-bottom: 1rem; text-align: center; }
</style>
