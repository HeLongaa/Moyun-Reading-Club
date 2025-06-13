<template>
  <div class="search-bg">
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
        <div v-if="results.book?.length">
          <h3>书籍</h3>
          <ul><li v-for="b in results.book" :key="b.id">{{ b.title }} - {{ b.author }}</li></ul>
        </div>
        <div v-if="results.journal?.length">
          <h3>书评</h3>
          <ul><li v-for="j in results.journal" :key="j.id">{{ j.title }} - {{ j.authorName }}</li></ul>
        </div>
        <div v-if="results.user?.length">
          <h3>用户</h3>
          <ul><li v-for="u in results.user" :key="u.id">{{ u.account }} ({{ u.role }})</li></ul>
        </div>
        <div v-if="results.group?.length">
          <h3>圈子</h3>
          <ul><li v-for="g in results.group" :key="g.id">{{ g.name }}</li></ul>
        </div>
        <div v-if="!results.book?.length && !results.journal?.length && !results.user?.length && !results.group?.length && !loading" class="empty-tip">
          无搜索结果
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import searchApi from '@/api/search.api'
const keyword = ref('')
const type = ref('')
const loading = ref(false)
const results = ref({})
const doSearch = async () => {
  if (!keyword.value) return
  loading.value = true
  const res = await searchApi.search({ keyword: keyword.value, type: type.value })
  results.value = res.data || {}
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
