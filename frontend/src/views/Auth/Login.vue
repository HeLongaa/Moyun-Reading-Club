<template>
  <AuthLayout>
    <div class="login-container">
      <h2>欢迎回到墨云读书会</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>邮箱</label>
          <input
              v-model="form.email"
              type="email"
              required
              placeholder="请输入注册邮箱"
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

        <button
            type="submit"
            :disabled="loading"
            class="primary-btn"
        >
          {{ loading ? '登录中...' : '立即登录' }}
        </button>

        <div class="auth-links">
          <router-link to="/register">没有账号？立即注册</router-link>
          <router-link to="/forgot-password">忘记密码？</router-link>
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
        email: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },

  methods: {
    ...mapActions('auth', ['login']),

    async handleSubmit() {
      this.loading = true
      this.error = null

      try {
        await this.login(this.form)
        this.$router.push(this.$route.query.redirect || '/')
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查输入'
      } finally {
        this.loading = false
      }
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.primary-btn {
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}
</style>