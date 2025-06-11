<template>
  <div>
    <el-table :data="members" style="width: 100%">
      <el-table-column prop="username" label="成员" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-select
            v-model="row.role"
            @change="(role) => handleRoleChange(row.id, role)"
          >
            <el-option label="普通成员" value="member" />
            <el-option label="管理员" value="admin" />
            <el-option label="创建者" value="creator" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-if="isOwner" label="操作">
        <template #default="{ row }">
          <el-button
            v-if="row.state === 'pending'"
            size="mini"
            type="success"
            @click="audit(row.id, true)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.state === 'pending'"
            size="mini"
            type="danger"
            @click="audit(row.id, false)"
          >
            拒绝
          </el-button>
          <el-button
            v-if="row.state !== 'pending' && row.role !== 'creator'"
            size="mini"
            type="danger"
            @click="remove(row.id)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MemberList',
  props: {
    members: {
      type: Array,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleRoleChange(userId, role) {
      this.$emit('update-role', { userId, role })
    },
    audit(userId, isOno) {
      this.$emit('audit', { userId, isOno })
    },
    remove(userId) {
      this.$emit('remove', userId)
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 120px;
}
.el-table {
  margin-bottom: 1rem;
}
</style>