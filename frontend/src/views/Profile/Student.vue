<template>
  <div class="profile-bg">
    <div class="page-header">
      <img class="page-logo" src="@/assests/images/logo.png" alt="logo" />
      <div class="nav-btns">
        <router-link to="/">首页</router-link>
        <router-link to="/books">书籍</router-link>
        <router-link to="/journal">书评</router-link>
        <router-link to="/circle">圈子</router-link>
        <router-link to="/profile">我的</router-link>
        <router-link to="/search">搜索</router-link>
      </div>
    </div>
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
        <!-- 我的书评适配中间白框 -->
        <div class="journal-summary-section white-box">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import journalApi from '@/api/journal.api'
export default {
  name: 'Student',
  data() {
    return {
      loading: true,
      error: '',
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
.profile-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  background: url('@/assests/images/moyun.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
}
.page-header {
  position: absolute;
  top: 24px;
  right: 48px;
  display: flex;
  align-items: center;
  z-index: 20;
}
.page-logo {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px #eee;
  object-fit: cover;
  border: 2px solid #e0e7ff;
  margin-right: 18px;
}
.nav-btns {
  display: flex;
  gap: 18px;
}
.nav-btns a {
  color: #409eff;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.85);
  transition: background 0.2s, color 0.2s;
}
.nav-btns a:hover {
  background: #409eff;
  color: #fff;
}
.profile-page {
  position: relative;
  z-index: 1;
  margin-top: 120px;
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
.journal-summary-section {
  margin-top: 2.5rem;
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1.2rem 1rem;
}
.journal-summary-section.white-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 1.5rem 1.2rem;
  margin-top: 2.5rem;
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