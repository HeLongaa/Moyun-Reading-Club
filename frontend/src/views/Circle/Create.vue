<template>
  <div class="circle-create">
    <h2>新建圈子</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group"><label>圈子名</label><input v-model="form.name" required /></div>
      <div class="form-group"><label>简介</label><textarea v-model="form.description" required /></div>
      <div class="form-group"><label>圈子图标</label><input type="file" @change="onIconFile" /></div>
      <button type="submit" :disabled="loading">{{ loading ? '提交中...' : '提交' }}</button>
      <button type="button" @click="cancel">取消</button>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import circlesApi from '@/api/circles.api'
const router = useRouter()
const form = ref({ name: '', description: '', icon: '' })
const iconFile = ref(null)
const loading = ref(false)
const error = ref('')
const onIconFile = e => { iconFile.value = e.target.files[0] }
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await circlesApi.createGroup({ name: form.value.name, description: form.value.description })
    if (res.success) {
      const id = res.data.id
      if (iconFile.value) {
        await circlesApi.uploadGroupIcon(id, iconFile.value)
      }
      router.push(`/circle/${id}`)
    } else {
      error.value = res.message || '创建失败'
    }
  } catch (e) {
    error.value = e.response?.data?.message || '创建失败'
  } finally {
    loading.value = false
  }
}
const cancel = () => router.push('/circle')
</script>
<style scoped>
.circle-create { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.form-group { margin-bottom: 1rem; }
input, textarea { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { margin-top: 0.5rem; padding: 0.5rem 1.5rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
.error-msg { color: #e74c3c; margin-bottom: 1rem; text-align: center; }
</style>
