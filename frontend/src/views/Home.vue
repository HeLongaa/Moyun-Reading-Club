<template>
  <div class="home-page">
    <div class="section">
      <h2>推荐书评</h2>
      <ul>
        <li v-for="j in homeData.featuredJournals || []" :key="j.id">{{ j.title }} - {{ j.authorName }}</li>
      </ul>
    </div>
    <div class="section">
      <h2>热门书籍</h2>
      <ul>
        <li v-for="b in homeData.hotBooks || []" :key="b.id">{{ b.title }} - {{ b.author }}</li>
      </ul>
    </div>
    <div class="section">
      <h2>活跃圈子</h2>
      <ul>
        <li v-for="g in homeData.activeGroups || []" :key="g.id">{{ g.name }}</li>
      </ul>
    </div>
    <div class="section">
      <h2>今日诗词</h2>
      <div>{{ homeData.weather?.poetry || '暂无' }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import homeApi from '@/api/home.api'
const homeData = ref({})
const fetchHome = async () => {
  const res = await homeApi.getHomeData()
  homeData.value = res.data || {}
}
onMounted(fetchHome)
</script>
<style scoped>
.home-page { max-width: 900px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.section { margin-bottom: 2rem; }
h2 { color: #409eff; margin-bottom: 0.8rem; }
ul { margin: 0.5rem 0 1rem 1.5rem; }
</style>
