<template>
  <div class="home-page">
    <div class="home-hero">
      <div class="hero-content">
        <h1 class="home-title">墨韵读书会</h1>
        <p class="home-subtitle">在这里，遇见书与远方，结识志同道合的朋友</p>
      </div>
      <img class="hero-img" src="https://img.helong.online/reading-hero.png" alt="读书会" />
    </div>
    <div class="section-cards">
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
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import homeApi from '@/api/home.api'
import { useRouter } from 'vue-router'
const router = useRouter()
const goJournal = id => router.push(`/journal/${id}`)
const goBook = id => router.push(`/books/${id}`)
const goGroup = id => router.push(`/circle/${id}`)
const homeData = ref({})
const fetchHome = async () => {
  const res = await homeApi.getHomeData()
  homeData.value = res.data || {}
}
onMounted(fetchHome)
</script>
<style scoped>
.home-page {
  max-width: 1200px;
  margin: 2rem auto;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 16px #e9e9f3;
  padding: 2rem 2rem 3rem 2rem;
}
.home-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  min-height: 180px;
}
.hero-content {
  flex: 1;
}
.home-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #22223b;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}
.home-subtitle {
  color: #4a4e69;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}
.hero-img {
  width: 180px;
  height: 120px;
  object-fit: contain;
  margin-left: 2rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px #eee;
}
.section-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}
.section-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #eee;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.section-card h2 {
  color: #409eff;
  margin-bottom: 1rem;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.icon {
  font-size: 1.2em;
}
ul {
  margin: 0 0 0.5rem 0;
  padding: 0;
  list-style: none;
}
.link-item {
  cursor: pointer;
  color: #2563eb;
  transition: text-decoration 0.2s, color 0.2s;
  padding: 0.3rem 0;
  font-size: 1.05rem;
  display: flex;
  flex-direction: column;
  border-bottom: 1px dashed #f0f0f0;
}
.link-item:last-child { border-bottom: none; }
.link-item:hover {
  text-decoration: underline;
  color: #337ecc;
  background: #f3f4f6;
  border-radius: 4px;
}
.item-title {
  font-weight: 500;
  color: #22223b;
}
.item-meta {
  color: #888;
  font-size: 0.95rem;
  margin-left: 0.5em;
}
.more-link {
  margin-top: 0.5rem;
  color: #409eff;
  text-decoration: none;
  font-size: 0.98rem;
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
  border-radius: 6px;
  padding: 1rem;
  color: #4a4e69;
  font-style: italic;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  min-height: 80px;
}
.poem-content {
  margin-bottom: 0.5rem;
  font-size: 1.15rem;
  color: #22223b;
}
.poem-title {
  color: #888;
  font-size: 0.98rem;
  text-align: right;
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
  .section-cards {
    grid-template-columns: 1fr;
  }
}
</style>
