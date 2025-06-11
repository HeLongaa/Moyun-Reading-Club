<template>
  <AuthLayout>
    <div class="login-container">
      <h2>欢迎登录墨云读书会</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>账号/邮箱</label>
          <input
            v-model="form.account"
            required
            placeholder="请输入账号或邮箱"
          >
        </div>
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="请输入密码"
          >
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button
          type="submit"
          :disabled="loading"
          class="primary-btn"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <div class="auth-links">
          <router-link to="/register">没有账号？立即注册</router-link>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script>
import AuthLayout from '@/layouts/AuthLayout'
import { mapActions } from 'vuex'

export default {
  components: { AuthLayout },
  data() {
    return {
      form: {
        account: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleSubmit() {
      this.loading = true
      this.error = ''
      try {
        await this.login(this.form)
        this.$router.push('/')
      } catch (e) {
        this.error = e.response?.data?.message || '登录失败'
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    // 已登录自动跳转主界面
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.error-msg {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
}
</style>