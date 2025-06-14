<template>
  <div class="notifications-view">
    <h2>通知中心</h2>
    <div class="actions">
      <button @click="markAllAsRead" :disabled="markingAll">全部已读</button>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <ul v-else>
      <template v-for="type in groupedTypes" :key="type.key">
        <li class="type-group">
          <h3>{{ type.label }}</h3>
          <ul>
            <li v-for="n in type.list" :key="n.id" :class="{ unread: !n.read }">
              <div class="title">
                <router-link v-if="n.type==='journal_comment'" :to="`/comments/${n.target_id}`">{{ n.title }}</router-link>
                <router-link v-else-if="n.type==='discussion_reply'" :to="`/circle/${n.group_id}/discussion/${n.discussion_id}`">{{ n.title }}</router-link>
                <span v-else>{{ n.title }}</span>
              </div>
              <div class="meta">
                <span>{{ n.created_at || n.time }}</span>
                <span v-if="!n.read" class="unread-tag">未读</span>
              </div>
              <button v-if="!n.read" @click="markAsRead(n)">标记已读</button>
            </li>
            <li v-if="!type.list.length" class="empty-tip">暂无此类通知</li>
          </ul>
        </li>
      </template>
      <li v-if="!notifications.length" class="empty-tip">暂无通知</li>
    </ul>
  </div>
</template>

<script>
import notificationsApi from '@/api/notifications.api'
export default {
  name: 'NotificationsView',
  data() {
    return {
      notifications: [],
      loading: false,
      error: '',
      markingAll: false
    }
  },
  async created() {
    await this.fetchNotifications()
  },
  computed: {
    groupedTypes() {
      // 假设后端返回 type 字段: journal_comment, discussion_reply
      const types = [
        { key: 'journal_comment', label: '书评评论', list: [] },
        { key: 'discussion_reply', label: '圈子讨论回复', list: [] }
      ]
      for (const n of this.notifications) {
        const t = types.find(t => t.key === n.type)
        if (t) t.list.push(n)
      }
      return types
    }
  },
  methods: {
    async fetchNotifications() {
      this.loading = true
      this.error = ''
      try {
        const res = await notificationsApi.getUnreadMessages()
        // 兼容后端返回结构
        if (res && res.data && Array.isArray(res.data.notifications)) {
          this.notifications = res.data.notifications
        } else if (Array.isArray(res.data)) {
          this.notifications = res.data
        } else if (Array.isArray(res)) {
          this.notifications = res
        } else {
          this.notifications = []
        }
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    async markAsRead(n) {
      try {
        if (n.type === 'journal_comment') {
          await notificationsApi.markJournalCommentAsRead(n.target_id)
        } else if (n.type === 'discussion_reply') {
          await notificationsApi.markDiscussionReplyAsRead(n.target_id)
        }
        await this.fetchNotifications()
      } catch (e) {
        this.error = '操作失败'
      }
    },
    async markAllAsRead() {
      this.markingAll = true
      try {
        await notificationsApi.markAllAsRead()
        await this.fetchNotifications()
      } catch (e) {
        this.error = '操作失败'
      } finally {
        this.markingAll = false
      }
    }
  }
}
</script>

<style scoped>
.notifications-view {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
}
.actions {
  margin-bottom: 1rem;
  text-align: right;
}
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; }
.empty-tip { color: #aaa; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
ul { list-style: none; padding: 0; }
li { border-bottom: 1px solid #eee; padding: 1rem 0; }
li.unread .title { font-weight: bold; color: #22223b; }
.title { font-size: 1.05rem; }
.meta { color: #888; font-size: 0.95rem; margin-top: 0.3rem; display: flex; gap: 1rem; }
.unread-tag { color: #e74c3c; font-weight: bold; }
button { margin-top: 0.5rem; background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 0.3rem 1rem; cursor: pointer; }
button:disabled { background: #ccc; cursor: not-allowed; }
.type-group { margin-bottom: 1.5rem; }
.type-group h3 { font-size: 1.2rem; margin: 0.5rem 0; }
</style>