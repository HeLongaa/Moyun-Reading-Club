<template>
  <div class="login-bg">
    <div class="login-container">
      <h2>欢迎登录墨韵读书会</h2>
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
          <span class="divider">|</span>
          <router-link to="/forgot-password">忘记密码？找回密码</router-link>
          <span class="divider">|</span>
          <router-link to="/reset-password">重置密码</router-link>
        </div>
      </form>
    </div>
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
.login-bg {
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
  align-items: center;
  justify-content: center;
}
.login-container {
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  background: rgba(255,255,255,0.96);
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.13);
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 0.5px;
}
h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}
.form-group {
  margin-bottom: 1.2rem;
}
label {
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  font-size: 1.1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.2rem;
  background: #f7f9fa;
  transition: border 0.2s;
}
input:focus {
  border: 1.5px solid #409eff;
  outline: none;
  background: #fff;
}
button.primary-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem 0;
  border-radius: 6px;
  background: linear-gradient(90deg,#409eff 60%,#6a82fb 100%);
  color: #fff;
  border: none;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(64,158,255,0.08);
  transition: background 0.2s;
}
button.primary-btn:hover {
  background: #3076d6;
}
button.primary-btn:active {
  background: #357ae8;
}
.error-msg {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.05rem;
}
.auth-links {
  margin-top: 1.2rem;
  text-align: center;
  font-size: 0.98rem;
  color: #666;
}
.auth-links a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.2s;
}
.auth-links a:hover {
  color: #3076d6;
  text-decoration: underline;
}
.divider {
  margin: 0 0.5rem;
  color: #ccc;
  display: inline-block;
  line-height: 1.5;
}
</style>