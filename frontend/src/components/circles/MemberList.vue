<template>
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
  </el-table>
</template>

<script>
export default {
  name: 'MemberList',
  props: {
    members: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleRoleChange(userId, role) {
      this.$emit('update-role', { userId, role })
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 120px;
}
</style>