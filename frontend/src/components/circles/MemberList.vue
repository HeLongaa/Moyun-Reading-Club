<template>
  <div class="member-list">
    <h3>成员列表</h3>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <ul v-else>
      <li v-for="member in members" :key="member.id" class="member-item">
        <span class="member-name">{{ member.account || member.name }}</span>
        <span class="member-role" v-if="isOwner && member.role">{{
          member.role
        }}</span>
        <!-- 其他成员信息 -->
      </li>
      <li v-if="!members || members.length === 0" class="empty-tip">暂无成员</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MemberList',
  props: {
    members: {
      type: Array,
      default: () => []
    },
    isOwner: Boolean,
    groupId: [String, Number]
  },
  data() {
    return {
      loading: false,
      error: ''
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