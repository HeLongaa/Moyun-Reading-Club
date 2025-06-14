<template>
  <div class="login-bg">
    <div class="login-container">
      <h2>找回密码</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>请输入注册邮箱</label>
          <input v-model="email" type="email" required placeholder="请输入注册邮箱">
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="success" class="success-msg">{{ success }}</div>
        <button type="submit" :disabled="loading" class="primary-btn">
          {{ loading ? '发送中...' : '发送重置邮件' }}
        </button>
        <div class="auth-links">
          <router-link to="/login">返回登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authApi from '@/api/auth.api'
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        await authApi.requestPasswordReset({ email: this.email })
        this.success = '重置邮件已发送，请查收邮箱！'
      } catch (e) {
        this.error = e.response?.data?.message || '发送失败，请检查邮箱是否正确'
      } finally {
        this.loading = false
      }
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
  font-size: 1.7rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1.6rem;
  letter-spacing: 3px;
  font-family: 'STKaiti', 'KaiTi', 'Segoe UI', Arial, sans-serif;
}
.form-group {
  margin-bottom: 1.3rem;
}
label {
  display: block;
  font-size: 0.97rem;
  color: #222;
  margin-bottom: 0.38rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #d0d7de;
  font-size: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.2rem;
  background: #f7f9fa;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
input:focus {
  border: 1.5px solid #409eff;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 2px #e3f0ff;
}
button.primary-btn {
  width: 100%;
  margin-top: 1.2rem;
  padding: 0.8rem 0;
  border-radius: 8px;
  background: linear-gradient(90deg,#409eff 60%,#6a82fb 100%);
  color: #fff;
  border: none;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(64,158,255,0.10);
  transition: background 0.2s, box-shadow 0.2s;
}
button.primary-btn:hover {
  background: #3076d6;
  box-shadow: 0 4px 16px rgba(64,158,255,0.13);
}
button.primary-btn:active {
  background: #357ae8;
}
.error-msg {
  color: #e74c3c;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.98rem;
  font-weight: 500;
}
.success-msg {
  color: #67c23a;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.98rem;
  font-weight: 500;
}
.auth-links {
  margin-top: 1.4rem;
  text-align: center;
  font-size: 0.93rem;
  color: #666;
}
.auth-links a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}
.auth-links a:hover {
  color: #3076d6;
  text-decoration: underline;
}
</style>
