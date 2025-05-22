<template>
  <div class="notification-list">
    <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification-item', { unread: !notification.read }]"
        @click="$emit('click:notification', notification)"
    >
      <NotificationIcon :type="notification.type" />
      <div class="content">
        <div class="message" v-html="notification.message" />
        <div class="time">{{ formatTime(notification.createdAt) }}</div>
      </div>
      <button
          v-if="!notification.read"
          class="mark-read"
          @click.stop="$emit('mark-read', notification.id)"
      >
        标记已读
      </button>
    </div>
  </div>
</template>

<script>
import NotificationIcon from './NotificationIcon.vue'
import { formatRelativeTime } from '@/utils/date'

export default {
  components: {
    NotificationIcon
  },

  props: {
    notifications: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    formatTime(timestamp) {
      return formatRelativeTime(timestamp)
    }
  }
}
</script>

<style lang="scss" scoped>
.notification-item {
  @include card-style;
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &.unread {
    background-color: var(--unread-bg);
  }

  .content {
    flex-grow: 1;
    margin-left: 1rem;

    .time {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  }

  .mark-read {
    @include small-button;
    margin-left: auto;
  }
}
</style>