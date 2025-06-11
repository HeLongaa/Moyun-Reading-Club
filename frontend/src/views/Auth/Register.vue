<template>
  <AuthLayout>
    <div class="register-container">
      <h2>加入墨云读书会</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>用户名</label>
          <input
              v-model="form.account"
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
          <label>手机号</label>
          <input
              v-model="form.telephone"
              required
              placeholder="请输入手机号"
          >
        </div>

        <div class="form-group">
          <label>个性签名</label>
          <input
              v-model="form.signature"
              placeholder="一句话介绍自己（可选）"
          >
        </div>

        <div class="form-group">
          <label>身份</label>
          <select v-model="form.role" required>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
          </select>
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

        <div v-if="error" class="error-msg">{{ error }}</div>

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
        account: '',
        password: '',
        email: '',
        telephone: '',
        signature: '',
        role: 'student'
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    async handleSubmit() {
      this.loading = true
      this.error = ''
      try {
        await this.register(this.form)
        this.$router.push('/')
      } catch (e) {
        this.error = e.response?.data?.message || '注册失败'
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
.register-container {
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

/* 复用登录页样式 */
</style>