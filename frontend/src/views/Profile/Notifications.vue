<template>
  <div class="notifications-view">
    <h2>通知中心</h2>
    
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="系统" name="system" />
      <el-tab-pane label="评论" name="comment" />
      <el-tab-pane label="圈子" name="circle" />
    </el-tabs>
    
    <div class="actions">
      <el-button 
        size="small" 
        @click="markAllAsRead"
        :loading="markingAll"
      >
        全部已读
      </el-button>
    </div>
    
    <el-table :data="notifications" style="width: 100%">
      <el-table-column prop="title" label="通知" />
      <el-table-column prop="created_at" label="时间" width="180" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag 
            size="small" 
            :type="row.read ? '' : 'danger'"
          >
            {{ row.read ? '已读' : '未读' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button 
            v-if="!row.read"
            size="mini" 
            @click="markAsRead(row.id)"
          >
            标记已读
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'NotificationsView',
  
  data() {
    return {
      activeTab: 'all',
      notifications: [],
      markingAll: false,
      loading: false
    }
  },
  
  computed: {
    ...mapState('notifications', ['unreadCount'])
  },
  
  created() {
    this.fetchNotifications()
  },
  
  methods: {
    ...mapActions('notifications', [
      'fetchNotifications',
      'fetchByType',
      'markAsRead',
      'markAllAsRead'
    ]),
    
    async fetchNotifications() {
      this.loading = true
      try {
        if (this.activeTab === 'all') {
          await this.fetchNotifications()
        } else {
          await this.fetchByType(this.activeTab)
        }
      } finally {
        this.loading = false
      }
    },
    
    handleTabChange() {
      this.fetchNotifications()
    },
    
    async markAsRead(id) {
      await this.markAsRead(id)
      this.fetchNotifications()
    },
    
    async markAllAsRead() {
      this.markingAll = true
      try {
        await this.markAllAsRead()
        this.fetchNotifications()
      } finally {
        this.markingAll = false
      }
    }
  }
}
</script>

<style scoped>
.notifications-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.actions {
  margin: 15px 0;
  text-align: right;
}
</style>