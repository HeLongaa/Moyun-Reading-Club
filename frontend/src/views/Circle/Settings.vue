<template>
  <div class="circle-settings">
    <h2>圈子设置</h2>
    <form @submit.prevent="handleSave">
      <div class="form-group">
        <label>圈子名称</label>
        <input v-model="form.name" required />
      </div>
      <div class="form-group">
        <label>圈子简介</label>
        <textarea v-model="form.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>圈子图标</label>
        <input type="file" @change="onIconChange" accept="image/*" />
      </div>
      <button type="submit" :disabled="loading">保存</button>
      <div v-if="error" class="error-tip">{{ error }}</div>
      <div v-if="success" class="success-tip">保存成功！</div>
    </form>
    <h3>成员审核</h3>
    <ul>
      <li v-for="m in pendingMembers" :key="m.user_id">
        {{ m.user.account }}
        <button @click="review(m.user_id, true)">同意</button>
        <button @click="review(m.user_id, false)">拒绝</button>
      </li>
      <li v-if="!pendingMembers.length" class="empty-tip">暂无待审核成员</li>
    </ul>
  </div>
</template>

<script>
import groupApi from '@/api/circles.api'
export default {
  name: 'CircleSettings',
  data() {
    return {
      form: { name: '', description: '' },
      icon: null,
      loading: false,
      error: '',
      success: false,
      pendingMembers: []
    }
  },
  async created() {
    const id = this.$route.params.id
    const res = await groupApi.getGroupDetail(id)
    this.form.name = res.data?.data?.name || ''
    this.form.description = res.data?.data?.description || ''
    await this.fetchPending()
  },
  methods: {
    onIconChange(e) {
      this.icon = e.target.files[0]
    },
    async handleSave() {
      this.loading = true
      this.error = ''
      this.success = false
      try {
        const id = this.$route.params.id
        await groupApi.updateGroup(id, this.form)
        if (this.icon) {
          const formData = new FormData()
          formData.append('icon', this.icon)
          await groupApi.uploadGroupIcon(id, formData)
        }
        this.success = true
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || '保存失败'
      } finally {
        this.loading = false
      }
    },
    async fetchPending() {
      const id = this.$route.params.id
      const res = await groupApi.getPendingMembers(id)
      this.pendingMembers = res.data?.data || []
    },
    async review(userId, isOno) {
      const id = this.$route.params.id
      await groupApi.reviewMember(id, userId, { isOno })
      await this.fetchPending()
    }
  }
}
</script>

<style scoped>
.circle-settings { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.form-group { margin-bottom: 1rem; }
.error-tip { color: #e74c3c; margin-top: 1rem; }
.success-tip { color: #27ae60; margin-top: 1rem; }
.empty-tip { color: #aaa; margin-top: 1rem; }
</style>