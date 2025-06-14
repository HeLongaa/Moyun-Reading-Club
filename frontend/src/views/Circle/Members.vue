<template>
  <div class="circle-members">
    <h2>圈子成员列表</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <ul v-else>
      <li v-for="m in members" :key="m.id">
        <span>{{ m.account }}</span>
        <span v-if="m.isFounder" style="color:#409eff;margin-left:8px;">(圈主)</span>
        <span v-if="m.signature" style="margin-left:8px;color:#888;">{{ m.signature }}</span>
      </li>
      <li v-if="members.length === 0" class="empty-tip">暂无成员</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      error: '',
      members: []
    }
  },
  async created() {
    try {
      const groupId = this.$route.params.id
      const res = await this.$store.dispatch('circle/fetchMembers', groupId)
      // 兼容后端返回结构
      let vuexMembers = this.$store.getters['circle/members']
      // 兼容后端返回 { members: [...] } 或直接数组
      if (Array.isArray(vuexMembers)) {
        this.members = vuexMembers
      } else if (vuexMembers && Array.isArray(vuexMembers.members)) {
        this.members = vuexMembers.members
      } else {
        this.members = []
      }
    } catch (e) {
      this.error = e?.message || '加载失败'
      this.members = []
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.circle-members {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 2rem;
}
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; }
.empty-tip { color: #aaa; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
ul { list-style: none; padding: 0; }
</style>
  padding: 2rem;
