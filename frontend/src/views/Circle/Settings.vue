<template>
  <div class="circle-settings">
    <h2>学习圈设置</h2>
    
    <el-form 
      :model="form" 
      label-width="120px"
      @submit.native.prevent="handleSubmit"
    >
      <el-form-item label="圈子名称">
        <el-input v-model="form.name" />
      </el-form-item>
      
      <el-form-item label="圈子描述">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :rows="3" 
        />
      </el-form-item>
      
      <el-form-item>
        <el-button 
          type="primary" 
          native-type="submit"
          :loading="loading"
        >
          保存设置
        </el-button>
      </el-form-item>
    </el-form>
    
    <h3>成员管理</h3>
    <member-list 
      :members="members" 
      @update-role="handleUpdateRole"
    />
    
    <el-divider />
    
    <el-popconfirm
      title="确定要删除这个圈子吗？"
      @confirm="handleDeleteCircle"
    >
      <el-button 
        slot="reference" 
        type="danger" 
        :loading="deleting"
      >
        删除圈子
      </el-button>
    </el-popconfirm>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MemberList from '@/components/circles/MemberList'

export default {
  name: 'CircleSettings',
  components: { MemberList },
  
  data() {
    return {
      loading: false,
      deleting: false,
      form: {
        name: '',
        description: ''
      },
      members: []
    }
  },
  
  computed: {
    ...mapState('circles', ['currentCircle'])
  },
  
  watch: {
    currentCircle: {
      immediate: true,
      handler(circle) {
        if (circle) {
          this.form = {
            name: circle.name,
            description: circle.description
          }
          this.fetchMembers()
        }
      }
    }
  },
  
  methods: {
    ...mapActions('circles', [
      'updateCircle',
      'fetchCircleMembers',
      'updateMemberRole',
      'deleteCircle'
    ]),
    
    async fetchMembers() {
      const members = await this.fetchCircleMembers(this.currentCircle.id)
      this.members = members
    },
    
    async handleSubmit() {
      this.loading = true
      try {
        await this.updateCircle({
          circleId: this.currentCircle.id,
          data: this.form
        })
        this.$message.success('设置已保存')
      } finally {
        this.loading = false
      }
    },
    
    async handleUpdateRole({ userId, role }) {
      await this.updateMemberRole({
        circleId: this.currentCircle.id,
        userId,
        role
      })
      this.$message.success('成员权限已更新')
    },
    
    async handleDeleteCircle() {
      this.deleting = true
      try {
        await this.deleteCircle(this.currentCircle.id)
        this.$message.success('圈子已删除')
        this.$router.push('/circles')
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style scoped>
.circle-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>