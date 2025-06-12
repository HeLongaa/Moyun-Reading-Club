<template>
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
</template>

<script>
export default {
  name: 'Login',
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
    async handleSubmit() {
      this.loading = true
      this.error = ''
      try {
        await this.$store.dispatch('auth/login', this.form)
        // 登录成功后跳转到重定向页面或首页
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (e) {
        this.error = e.response?.data?.message || '登录失败'
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
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
.form-group {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button.primary-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem 0;
  border-radius: 4px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
}
.error-msg {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
}
.auth-links {
  margin-top: 1rem;
  text-align: center;
}
</style>