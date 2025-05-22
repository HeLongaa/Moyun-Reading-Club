<template>
  <AuthLayout>
    <div class="register-container">
      <h2>加入墨云读书会</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>用户名</label>
          <input
              v-model="form.username"
              required
              placeholder="请输入用户名"
          >
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input
              v-model="form.email"
              type="email"
              required
              placeholder="请输入有效邮箱"
          >
        </div>

        <div class="form-group">
          <label>密码</label>
          <input
              v-model="form.password"
              type="password"
              required
              placeholder="至少8位字符"
          >
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <input
              v-model="form.password2"
              type="password"
              required
              placeholder="再次输入密码"
          >
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="primary-btn"
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </button>

        <div class="auth-links">
          <router-link to="/login">已有账号？立即登录</router-link>
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
        username: '',
        email: '',
        password: '',
        password2: ''
      },
      loading: false,
      error: null
    }
  },

  methods: {
    ...mapActions('auth', ['register']),

    async handleSubmit() {
      if (this.form.password !== this.form.password2) {
        this.error = '两次输入的密码不一致'
        return
      }

      this.loading = true
      this.error = null

      try {
        await this.register({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password
        })

        this.$router.push({
          path: '/login',
          query: { registered: 'success' }
        })
      } catch (error) {
        this.error = error.response?.data?.message || '注册失败，请稍后重试'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

/* 复用登录页样式 */
</style>