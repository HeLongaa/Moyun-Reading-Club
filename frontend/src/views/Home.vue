<template>
  <div class="home-bg">
    <div class="home-page">
      <div class="home-hero">
        <div class="hero-content">
          <h1 class="home-title">墨韵读书会</h1>
          <p class="home-subtitle">在这里，遇见书与远方，结识志同道合的朋友</p>
        </div>
        <div class="logo-frame">
          <img class="hero-img logo-img" src="@/assests/images/logo.png" alt="读书会" />
        </div>
      </div>
      <!-- 横向滑动功能区 -->
      <div class="section-cards-scroll">
        <div class="section-cards-inner">
          <div class="section-card">
            <h2><span class="icon">📖</span> 推荐书评</h2>
            <ul>
              <li
                v-for="j in homeData.featuredJournals || []"
                :key="j.id"
                @click="goJournal(j.id)"
                class="link-item"
              >
                <span class="item-title">{{ j.title }}</span>
                <span class="item-meta">by {{ j.author?.account || j.authorName }}</span>
              </li>
            </ul>
            <router-link to="/journal" class="more-link">更多书评 &gt;</router-link>
          </div>
          <div class="section-card">
            <h2><span class="icon">📚</span> 热门书籍</h2>
            <ul>
              <li
                v-for="b in homeData.popularBooks || homeData.hotBooks || []"
                :key="b.id"
                @click="goBook(b.id)"
                class="link-item"
              >
                <span class="item-title">{{ b.title }}</span>
                <span class="item-meta">by {{ b.author }}</span>
              </li>
            </ul>
            <router-link to="/books" class="more-link">更多书籍 &gt;</router-link>
          </div>
          <div class="section-card">
            <h2><span class="icon">👥</span> 活跃圈子</h2>
            <ul>
              <li
                v-for="g in homeData.activeGroups || []"
                :key="g.id"
                @click="goGroup(g.id)"
                class="link-item"
              >
                <span class="item-title">{{ g.name }}</span>
                <span class="item-meta">{{ g.description || '' }}</span>
              </li>
            </ul>
            <router-link to="/circle" class="more-link">更多圈子 &gt;</router-link>
          </div>
          <div class="section-card poem-card">
            <h2><span class="icon">📝</span> 今日诗词</h2>
            <div class="poetry-block">
              <div v-if="homeData.poem?.content">
                <div class="poem-content">{{ homeData.poem.content }}</div>
                <div class="poem-title">
                  ——《{{ homeData.poem.origin?.title || '未知' }}》
                  <span v-if="homeData.poem.origin?.author">·{{ homeData.poem.origin.author }}</span>
                </div>
              </div>
              <div v-else>暂无</div>
            </div>
          </div>
          <div class="section-card">
            <h2><span class="icon">🔍</span> 搜索</h2>
            <router-link to="/search" class="more-link">全站搜索 &gt;</router-link>
          </div>
          <div class="section-card">
            <h2><span class="icon">📤</span> 上传书籍</h2>
            <router-link to="/books/upload" class="more-link">上传书籍 &gt;</router-link>
          </div>
          <div class="section-card">
            <h2><span class="icon">🤖</span> AI 书籍推荐</h2>
            <router-link to="/ai/recommend" class="more-link">AI 书籍推荐 &gt;</router-link>
          </div>
          <div class="section-card">
            <h2><span class="icon">🤖</span> AI 聊天助手</h2>
            <router-link to="/ai/chat" class="more-link">AI 聊天助手 &gt;</router-link>
          </div>
          <div class="section-card">
            <h2><span class="icon">📈</span> 个人统计</h2>
            <router-link to="/profile/stats" class="more-link">查看统计 &gt;</router-link>
          </div>
        </div>
      </div>
      <div v-if="error" class="error-tip">{{ error }}</div>
    </div>
    <button class="logout-float-btn" @click="logout">退出登录</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import homeApi from '@/api/home.api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const goJournal = id => router.push(`/journal/${id}`)
const goBook = id => router.push(`/books/${id}`)
const goGroup = id => router.push(`/circle/${id}`)
const homeData = ref({})
const error = ref('')
const fetchHome = async () => {
  try {
    const res = await homeApi.getHomeData()
    // 兼容后端返回结构
    if (res && res.data && res.data.data) {
      homeData.value = res.data.data
    } else if (res && res.data) {
      homeData.value = res.data
    } else {
      homeData.value = {}
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('首页数据加载失败:', e, e?.response)
    if (e?.response?.data?.error) {
      error.value = e.response.data.error
    } else if (e?.message) {
      error.value = e.message
    } else {
      error.value = '首页加载失败，请稍后重试'
    }
  }
}
const logout = () => {
  store.commit('auth/LOGOUT')
  router.replace('/login')
}
onMounted(fetchHome)
</script>
<style scoped>
.home-bg {
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
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}
.home-page {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 3.5rem auto 2.5rem auto;
  background: rgba(255,255,255,0.97);
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(64,158,255,0.13);
  padding: 2.5rem 2.5rem 3.5rem 2.5rem;
  min-height: 80vh;
}
.home-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%);
  border-radius: 14px;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  margin-bottom: 2.5rem;
  min-height: 200px;
  box-shadow: 0 2px 16px #e9e9f3;
}
.hero-content {
  flex: 1;
}
.home-title {
  font-size: 2.8rem;
  font-weight: bold;
  color: #22223b;
  margin-bottom: 1.2rem;
  letter-spacing: 4px;
  font-family: 'STKaiti', 'KaiTi', 'Segoe UI', Arial, sans-serif;
}
.home-subtitle {
  color: #4a4e69;
  font-size: 1.25rem;
  margin-bottom: 0.7rem;
  letter-spacing: 1.5px;
}
.logo-frame {
  width: 200px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.section-cards-scroll {
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.section-cards-inner {
  display: flex;
  flex-direction: row;
  gap: 2.2rem;
  min-width: 900px;
}
.section-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #e0e7ff;
  padding: 1.7rem 1.3rem 1.3rem 1.3rem;
  min-width: 270px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: box-shadow 0.2s, transform 0.2s;
  flex: 0 0 270px;
}
.section-card:hover {
  box-shadow: 0 6px 24px #b3c6ff;
  transform: translateY(-2px) scale(1.02);
}
.section-card h2 {
  color: #409eff;
  margin-bottom: 1rem;
  font-size: 1.18rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.icon {
  font-size: 1.25em;
}
ul {
  margin: 0 0 0.5rem 0;
  padding: 0;
  list-style: none;
}
.link-item {
  cursor: pointer;
  color: #2563eb;
  transition: text-decoration 0.2s, color 0.2s, background 0.2s;
  padding: 0.35rem 0.2rem;
  font-size: 1.08rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px dashed #f0f0f0;
  border-radius: 4px;
}
.link-item:last-child { border-bottom: none; }
.link-item:hover {
  text-decoration: underline;
  color: #337ecc;
  background: #f3f4f6;
}
.item-title {
  font-weight: 500;
  color: #22223b;
}
.item-meta {
  color: #888;
  font-size: 0.97rem;
  margin-left: 0.5em;
}
.more-link {
  margin-top: 0.5rem;
  color: #409eff;
  text-decoration: none;
  font-size: 1rem;
  align-self: flex-end;
  transition: color 0.2s;
}
.more-link:hover {
  color: #2563eb;
  text-decoration: underline;
}
.poem-card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.poetry-block {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1.1rem;
  color: #4a4e69;
  font-style: italic;
  font-size: 1.13rem;
  margin-top: 0.5rem;
  min-height: 80px;
}
.poem-content {
  margin-bottom: 0.5rem;
  font-size: 1.18rem;
  color: #22223b;
}
.poem-title {
  color: #888;
  font-size: 1rem;
  text-align: right;
}
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
.logout-float-btn {
  position: fixed;
  right: 36px;
  bottom: 36px;
  z-index: 100;
  background: linear-gradient(90deg,#409eff 60%,#6a82fb 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 2px 12px #e0e7ff;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.logout-float-btn:hover {
  background: #e74c3c;
}
@media (max-width: 900px) {
  .home-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem 1rem;
  }
  .hero-img {
    margin: 1rem 0 0 0;
    width: 100%;
    height: 100px;
  }
  .section-cards-scroll {
    padding-bottom: 0.5rem;
  }
  .section-cards-inner {
    gap: 1.2rem;
    min-width: 0;
  }
  .section-card {
    min-width: 80vw;
    flex: 0 0 80vw;
  }
}
</style>
