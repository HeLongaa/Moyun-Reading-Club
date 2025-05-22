<template>
  <MainLayout>
    <div class="circle-settings">
      <h2>学习圈设置</h2>

      <form @submit.prevent="saveSettings">
        <div class="form-group">
          <label>圈子名称</label>
          <input v-model="form.name" required />
        </div>

        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" rows="4" />
        </div>

        <div class="privacy-setting">
          <label>
            <input type="checkbox" v-model="form.isPublic" />
            公开圈子
          </label>
        </div>

        <button type="submit" :disabled="isSaving">
          {{ isSaving ? '保存中...' : '保存设置' }}
        </button>
      </form>
    </div>
  </MainLayout>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        isPublic: true
      },
      isSaving: false
    }
  },

  async created() {
    const circle = await this.$store.dispatch('circles/getCircleDetails', this.$route.params.id)
    this.form = { ...circle }
  },

  methods: {
    async saveSettings() {
      this.isSaving = true
      try {
        await this.$store.dispatch('circles/updateCircle', {
          id: this.$route.params.id,
          data: this.form
        })
        this.$notify.success('设置已保存')
      } catch (error) {
        this.$notify.error('保存失败')
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>