<template>
  <div class="search-bg">
    <div class="search-page">
      <div class="search-bar">
        <input v-model="keyword" placeholder="搜索书籍、书评、用户、圈子..." @keyup.enter="doSearch" />
        <select v-model="type">
          <option value="">全部</option>
          <option value="book">书籍</option>
          <option value="journal">书评</option>
          <option value="user">用户</option>
          <option value="group">圈子</option>
        </select>
        <button @click="doSearch">搜索</button>
      </div>
      <div v-if="loading" class="loading">搜索中...</div>
      <div v-else>
        <!-- 全部类型时显示所有分类 -->
        <template v-if="!type">
          <div v-if="results.book.length">
            <h3>书籍</h3>
            <ul>
              <li v-for="b in results.book" :key="b.id">{{ b.title }} - {{ b.author }}</li>
            </ul>
          </div>
          <div v-if="results.journal.length">
            <h3>书评</h3>
            <ul>
              <li v-for="j in results.journal" :key="j.id">{{ j.title }} - {{ j.authorName || j.author?.account || j.author_id }}</li>
            </ul>
          </div>
          <div v-if="results.user.length">
            <h3>用户</h3>
            <ul>
              <li v-for="u in results.user" :key="u.id">{{ u.account }} ({{ u.role }})</li>
            </ul>
          </div>
          <div v-if="results.group.length">
            <h3>圈子</h3>
            <ul>
              <li v-for="g in results.group" :key="g.id">{{ g.name }}</li>
            </ul>
          </div>
        </template>
        <!-- 指定类型时只显示该类型 -->
        <template v-else>
          <div v-if="type==='book' && results.book.length">
            <h3>书籍</h3>
            <ul>
              <li v-for="b in results.book" :key="b.id">{{ b.title }} - {{ b.author }}</li>
            </ul>
          </div>
          <div v-if="type==='journal' && results.journal.length">
            <h3>书评</h3>
            <ul>
              <li v-for="j in results.journal" :key="j.id">{{ j.title }} - {{ j.authorName || j.author?.account || j.author_id }}</li>
            </ul>
          </div>
          <div v-if="type==='user' && results.user.length">
            <h3>用户</h3>
            <ul>
              <li v-for="u in results.user" :key="u.id">{{ u.account }} ({{ u.role }})</li>
            </ul>
          </div>
          <div v-if="type==='group' && results.group.length">
            <h3>圈子</h3>
            <ul>
              <li v-for="g in results.group" :key="g.id">{{ g.name }}</li>
            </ul>
          </div>
        </template>
        <div v-if="!hasAnyResult && !loading" class="empty-tip">
          无搜索结果
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import searchApi from '@/api/search.api'
const keyword = ref('')
const type = ref('')
const loading = ref(false)
const results = ref({
  book: [],
  journal: [],
  user: [],
  group: []
})

const hasAnyResult = computed(() =>
  results.value.book.length ||
  results.value.journal.length ||
  results.value.user.length ||
  results.value.group.length
)

const doSearch = async () => {
  if (!keyword.value) return
  loading.value = true
  results.value = { book: [], journal: [], user: [], group: [] }
  try {
    const res = await searchApi.search({
      keyword: keyword.value,
      type: type.value,
      page: 1,
      limit: 50
    })
    const data = res?.data?.data || {}
    let arr = []
    if (Array.isArray(data.results)) {
      arr = data.results
    } else if (Array.isArray(data)) {
      arr = data
    } else if (Array.isArray(res?.data?.results)) {
      arr = res.data.results
    }
    results.value = { book: [], journal: [], user: [], group: [] }
    arr.forEach(item => {
      if (item.title && item.author && item.isbn) {
        results.value.book.push(item)
      } else if (item.title && (item.authorName || item.author_id || item.author)) {
        results.value.journal.push(item)
      } else if (item.account && item.role) {
        results.value.user.push(item)
      } else if (item.name && (item.founder_id || item.founder)) {
        results.value.group.push(item)
      }
    })
  } catch (e) {
    results.value = { book: [], journal: [], user: [], group: [] }
  }
  loading.value = false
}
</script>
<style scoped>
.search-bg {
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
.search-page {
  position: relative;
  z-index: 1;
  margin-top: 120px;
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 2rem;
  min-height: 400px;
}
.search-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
input, select { padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 0.5rem 1.5rem; cursor: pointer; }
h3 { margin-top: 1.5rem; }
ul { margin: 0.5rem 0 1rem 1.5rem; }
.loading { text-align: center; color: #888; margin: 2rem 0; }
.empty-tip { color: #aaa; text-align: center; margin: 2rem 0; font-size: 1.1rem; }
</style>

