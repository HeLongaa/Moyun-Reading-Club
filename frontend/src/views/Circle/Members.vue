<template>
  <div class="circle-members">
    <h2>成员列表</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <ul v-else>
      <li v-for="member in members" :key="member.id" class="member-item">
        <span class="member-name">{{ member.account || member.name }}</span>
        <span class="member-role" v-if="member.role">({{ member.role }})</span>
      </li>
      <li v-if="!members.length" class="empty-tip">暂无成员</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CircleMembers',
  data() {
    return {
      loading: true,
      error: '',
      members: []
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async created() {
    try {
      const groupId = this.$route.params.id
      // 假设有 circle/fetchMembers action
      await this.$store.dispatch('circle/fetchMembers', groupId)
      this.members = this.$store.getters['circle/members']
    } catch (e) {
      this.error = e?.message || '加载失败'
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
.member-item { border-bottom: 1px solid #eee; padding: 1rem 0; }
.member-name { font-weight: bold; color: #22223b; }
.member-role { color: #409eff; margin-left: 1rem; }
</style>
