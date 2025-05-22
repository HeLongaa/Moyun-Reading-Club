<template>
  <MainLayout>
    <div class="notifications-view">
      <h2>通知中心</h2>

      <div class="header-actions">
        <button @click="markAllAsRead" class="mark-read-button">
          全部标记为已读
        </button>
      </div>

      <NotificationList
          :notifications="notifications"
          @click:notification="handleNotificationClick"
          class="notification-list"
      />

      <div v-if="isLoading" class="loading-indicator">
        加载中...
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NotificationList from '@/components/ui/NotificationSystem/NotificationList.vue'

export default {
  components: {
    NotificationList
  },

  data() {
    return {
      isLoading: false
    }
  },

  computed: {
    ...mapState('notifications', ['notifications'])
  },

  async created() {
    await this.loadNotifications()
  },

  methods: {
    ...mapActions('notifications', ['fetchNotifications', 'markAllRead']),

    async loadNotifications() {
      this.isLoading = true
      try {
        await this.fetchNotifications()
      } finally {
        this.isLoading = false
      }
    },

    async markAllAsRead() {
      await this.markAllRead()
    },

    handleNotificationClick(notification) {
      if (notification.link) {
        this.$router.push(notification.link)
      }
      if (!notification.read) {
        this.$store.dispatch('notifications/markAsRead', notification.id)
      }
    }
  }
}
</script>