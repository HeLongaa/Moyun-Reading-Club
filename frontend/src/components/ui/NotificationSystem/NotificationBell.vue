<template>
  <div class="notification-bell">
    <div class="bell-container" @click="toggleDropdown">
      <BellIcon class="bell-icon" />
      <span v-if="unreadCount" class="badge">{{ unreadCount }}</span>
    </div>

    <div v-if="showDropdown" class="dropdown">
      <div class="header">
        <h3>通知</h3>
        <button @click="markAllRead">全部已读</button>
      </div>

      <div class="notification-list">
        <div
            v-for="noti in notifications"
            :key="noti.id"
            class="notification-item"
            :class="{ unread: !noti.read }"
            @click="handleClick(noti)"
        >
          <div class="notification-content">
            <NotificationIcon :type="noti.type" />
            <div class="text">
              <span v-html="renderContent(noti)"></span>
              <div class="time">{{ formatTime(noti.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      showDropdown: false
    }
  },

  computed: {
    ...mapState('notifications', ['all', 'unreadCount']),
    notifications() {
      return this.all.slice(0, 10) // 显示最近10条
    }
  },

  methods: {
    ...mapActions('notifications', ['fetchNotifications', 'markAllRead']),

    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        this.fetchNotifications()
      }
    },

    handleClick(notification) {
      if (!notification.read) {
        this.$store.commit('notifications/MARK_AS_READ', notification.id)
      }
      this.$router.push(notification.link)
      this.showDropdown = false
    },

    renderContent(noti) {
      const maps = {
        comment: `${noti.actor} 回复了你的评论`,
        mention: `${noti.actor} 提到了你`,
        circle: `新成员加入了圈子 ${noti.target}`,
        like: `${noti.actor} 赞了你的${noti.target_type}`
      }
      return maps[noti.type] || '新通知'
    }
  }
}
</script>