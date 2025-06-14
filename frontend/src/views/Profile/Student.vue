<template>
  <div class="profile-page">
    <h2>个人中心</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error-tip">{{ error }}</div>
    <div v-else-if="!user" class="empty-tip">未获取到用户信息</div>
    <div v-else>
      <div class="profile-info">
        <div><strong>用户名：</strong>{{ user.account }}</div>
        <div><strong>邮箱：</strong>{{ user.email }}</div>
        <div><strong>手机号：</strong>{{ user.telephone }}</div>
        <div><strong>身份：</strong>{{ user.role === 'teacher' ? '教师' : (user.role === 'mentor' ? '导师' : '学生') }}</div>
        <div><strong>个性签名：</strong>{{ user.signature || '暂无' }}</div>
      </div>
      <div class="profile-stats" v-if="stats">
        <h3>我的统计</h3>
        <ul>
          <li>书评数：{{ stats.journalCount }}</li>
          <li>点赞数：{{ stats.likeCount }}</li>
          <li>评论数：{{ stats.commentCount }}</li>
          <li>圈子数：{{ stats.groupCount }}</li>
        </ul>
      </div>
      <div class="journal-summary-section">
        <h3>我发表的书评</h3>
        <div v-if="journalsLoading" class="loading">加载中...</div>
        <div v-else-if="journalsError" class="error-msg">{{ journalsError }}</div>
        <ul v-else>
          <li v-for="j in journals" :key="j.id" class="journal-item">
            <div class="journal-title-row">
              <span class="journal-title">{{ j.title }}</span>
              <span class="journal-meta">
                {{ j.book?.title || j.book_id }}
                <span v-if="j.publish_time"> · {{ j.publish_time.slice(0,16) }}</span>
              </span>
            </div>
            <div class="journal-content-preview">{{ j.first_paragraph || (j.content ? j.content.slice(0,80) : '') }}</div>
          </li>
          <li v-if="!journals.length" class="empty-tip">暂无书评</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStats } from '@/api/profile.api'
import journalApi from '@/api/journal.api'
export default {
  name: 'Student',
  data() {
    return {
      loading: true,
      error: '',
      stats: null,
      journals: [],
      journalsLoading: false,
      journalsError: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  async created() {
    try {
      await this.$store.dispatch('auth/getUserProfile')
      const res = await getStats()
      this.stats = res.data?.data || null
      await this.fetchMyJournals()
    } catch (e) {
      this.error = e?.message || '获取用户信息失败'
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchMyJournals() {
      this.journalsLoading = true
      this.journalsError = ''
      try {
        const res = await journalApi.getJournals({ userId: this.user.id })
        this.journals = res.data?.data?.journals || res.data?.journals || []
      } catch (e) {
        this.journalsError = e?.response?.data?.error || e?.message || '加载失败'
      } finally {
        this.journalsLoading = false
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
  min-height: 300px;
}
.profile-info > div {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.loading { text-align: center; color: #888; margin: 2rem 0; }
.empty-tip { color: #aaa; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
.profile-stats {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
.profile-stats h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.profile-stats ul {
  list-style: none;
  padding: 0;
}
.profile-stats li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.journal-summary-section {
  margin-top: 2.5rem;
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1.2rem 1rem;
}
.journal-summary-section h3 {
  font-size: 1.13rem;
  color: #409eff;
  margin-bottom: 0.7rem;
  font-weight: 600;
}
.journal-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.journal-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.journal-title {
  font-weight: bold;
  color: #22223b;
  font-size: 1.08rem;
}
.journal-meta {
  color: #888;
  font-size: 0.97rem;
}
.journal-content-preview {
  color: #22223b;
  margin-top: 0.3rem;
  font-size: 1.01rem;
  line-height: 1.6;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 1.5rem 0;
}
.loading, .error-msg {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.error-msg { color: #e74c3c; }
</style>