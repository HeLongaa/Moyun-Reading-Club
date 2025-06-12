<template>
  <div class="profile-page">
    <h2>个人中心</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <div v-else-if="!user" class="empty-tip">未获取到用户信息</div>
    <div v-else>
      <div class="profile-info">
        <div><strong>用户名：</strong>{{ user.account }}</div>
        <div><strong>邮箱：</strong>{{ user.email }}</div>
        <div><strong>手机号：</strong>{{ user.telephone }}</div>
        <div><strong>身份：</strong>{{ user.role === 'teacher' ? '教师' : (user.role === 'mentor' ? '导师' : '学生') }}</div>
        <div><strong>个性签名：</strong>{{ user.signature || '暂无' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Student',
  data() {
    return {
      loading: true,
      error: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async created() {
    try {
      await this.$store.dispatch('auth/getUserProfile')
    } catch (e) {
      this.error = e?.message || '获取用户信息失败'
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
  min-height: 300px;
}
.profile-info > div {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.loading { text-align: center; color: #888; margin: 2rem 0; }
.empty-tip { color: #aaa; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
</style>