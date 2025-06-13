<template>
  <div class="circle-join-page">
    <h2>加入圈子</h2>
    <div v-if="joined" class="success-tip">已提交申请，等待圈主审核</div>
    <div v-else>
      <button @click="join" :disabled="loading">{{ loading ? '提交中...' : '提交加入申请' }}</button>
      <div v-if="error" class="error-tip">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import circlesApi from '@/api/circles.api'
export default {
  name: 'CircleJoin',
  data() {
    return {
      loading: false,
      error: '',
      joined: false
    }
  },
  methods: {
    async join() {
      this.loading = true
      this.error = ''
      try {
        const id = this.$route.params.id
        const res = await circlesApi.joinGroup(id)
        if (res.success) {
          this.joined = true
        } else {
          this.error = res.error || res.message || '提交失败'
        }
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || '提交失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.circle-join-page {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 2rem;
  text-align: center;
}
.success-tip { color: #67c23a; margin-top: 1rem; }
.error-tip { color: #e74c3c; margin-top: 1rem; }
</style>
