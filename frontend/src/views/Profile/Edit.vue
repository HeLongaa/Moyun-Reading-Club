<template>
  <div class="edit-profile-container">
    <h2>编辑个人资料</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>邮箱</label>
        <input v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label>手机号</label>
        <input v-model="form.telephone" required />
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
    ...mapGetters('profile', ['profile'])
  },
  created() {
    if (this.profile) {
      this.form.email = this.profile.email
      this.form.telephone = this.profile.telephone
      this.form.signature = this.profile.signature
    }
  },
  methods: {
    ...mapActions('profile', ['updateProfile', 'fetchProfile']),
    async handleSubmit() {
      this.loading = true
      this.error = null
      try {
        await this.updateProfile(this.form)
        await this.fetchProfile()
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
.edit-profile-container {
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
