<template>
  <MainLayout>
    <div class="circle-home">
      <div class="header">
        <h1>{{ circle.name }}</h1>
        <div class="meta">
          <span class="mentor">
            <img :src="circle.mentor.avatar" class="avatar">
            {{ circle.mentor.name }}
          </span>
          <span class="members">
            {{ circle.memberCount }} 位成员
          </span>
        </div>
      </div>

      <div class="content">
        <div class="sidebar">
          <nav class="circle-menu">
            <router-link
                v-for="tab in tabs"
                :key="tab.path"
                :to="`/circle/${circle.id}/${tab.path}`"
            >
              {{ tab.name }}
            </router-link>
          </nav>
        </div>

        <div class="main-content">
          <router-view :circle="circle" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('circles', ['currentCircle']),
    circle() {
      return this.currentCircle || {}
    },
    tabs() {
      return [
        { path: 'discussion', name: '讨论区' },
        { path: 'library', name: '共享书库' },
        { path: 'members', name: '成员列表' },
        ...(this.isMentor ? [{ path: 'settings', name: '设置' }] : [])
      ]
    },
    isMentor() {
      return this.$store.state.auth.user.role === 'mentor'
    }
  },

  async created() {
    await this.fetchCircleDetail(this.$route.params.id)
  },

  methods: {
    ...mapActions('circles', ['fetchCircleDetail'])
  }
}
</script>

<style scoped>
.circle-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
  color: #666;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
}

.circle-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.circle-menu a {
  padding: 0.75rem;
  border-radius: 4px;
  color: #666;
  text-decoration: none;
}

.circle-menu a.router-link-exact-active {
  background: #f3f4f6;
  color: #2563eb;
}
</style>