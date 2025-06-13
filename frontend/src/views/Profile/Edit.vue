<template>
  <div class="profile-bg">
    <div class="edit-profile-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
        </div>
        <div class="form-group">
          <label>个性签名</label>
          <input v-model="form.signature" />
        </div>
        <button type="submit" :disabled="loading">保存</button>
        <router-link to="/profile">取消</router-link>
        <div v-if="error" class="error-msg">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: '',
        telephone: '',
        signature: ''
      },
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  created() {
    // 修正：从 auth/user 获取初始信息
    if (this.user) {
      this.form.email = this.user.email
      this.form.telephone = this.user.telephone
      this.form.signature = this.user.signature
    }
  },
  methods: {
    ...mapActions('auth', ['getUserProfile']),
    async handleSubmit() {
      this.loading = true
      this.error = null
      try {
        // 假设有 updateProfile 方法，或用 getUserProfile 刷新
        await this.$store.dispatch('auth/updateProfile', this.form)
        await this.getUserProfile()
        this.$router.push('/profile')
      } catch (e) {
        this.error = e.response?.data?.message || '保存失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.profile-bg {
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
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
}
.page-header {
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  align-items: center;
  z-index: 20;
}
.page-logo {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px #eee;
  object-fit: cover;
  border: 2px solid #e0e7ff;
  margin-right: 18px;
}
.nav-btns {
  display: flex;
  gap: 18px;
}
.nav-btns a {
  color: #409eff;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.85);
  transition: background 0.2s, color 0.2s;
}
.nav-btns a:hover {
  background: #409eff;
  color: #fff;
}
.edit-profile-container {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 400px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.error-msg {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}
</style>
