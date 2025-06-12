<template>
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
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',
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
      // 前端校验
      if (!this.form.account || !this.form.password || !this.form.email || !this.form.telephone) {
        this.error = '请填写所有必填项'
        return
      }
      if (this.form.password !== this.form.password2) {
        this.error = '两次输入的密码不一致'
        return
      }
      this.loading = true
      this.error = ''
      try {
        const res = await this.register(this.form)
        // 兼容 res 可能为 true、undefined、对象或 Promise
        if (res !== true) {
          // 如果 res 是对象，尝试显示后端返回的 message 或 error
          if (res && typeof res === 'object' && (res.message || res.error)) {
            this.error = res.message || res.error || '注册失败'
          } else if (typeof res === 'string') {
            this.error = res
          } else {
            this.error = '注册失败'
          }
          return
        }
        this.$router.push(this.$route.query.redirect || '/')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('注册失败后端返回:', e, e?.response)
        if (e?.message?.includes('ERR_CONNECTION_REFUSED') || e?.message?.includes('Failed to fetch')) {
          this.error = '无法连接后端服务，请检查后端是否启动，或 API 地址是否正确'
        } else if (e && e.response && e.response.data && (e.response.data.message || e.response.data.error)) {
          this.error = e.response.data.message || e.response.data.error
        } else if (typeof e === 'string') {
          this.error = e
        } else {
          this.error = e?.message || '注册失败'
        }
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