<template>
  <div class="ai-recommend">
    <h2>AI 书籍推荐</h2>
    <form @submit.prevent="submitRecommend">
      <div class="form-group">
        <label>我的阅读偏好：</label>
        <input v-model="preferences" placeholder="如：科幻、历史、文学..." />
      </div>
      <div class="form-group">
        <label>排除书籍（可选）：</label>
        <input v-model="exclude" placeholder="如：三国演义, 红楼梦..." />
      </div>
      <button type="submit" :disabled="loading">获取推荐</button>
    </form>
    <div v-if="loading">推荐中...</div>
    <div v-if="error" class="error-tip">{{ error }}</div>
    <div v-if="result && result.length">
      <h3>推荐结果</h3>
      <ul>
        <li v-for="book in result" :key="book.id || book.title">{{ book.title || book }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import aiApi from '@/api/ai.api';

const preferences = ref('');
const exclude = ref('');
const loading = ref(false);
const error = ref('');
const result = ref([]);

const submitRecommend = async () => {
  loading.value = true;
  error.value = '';
  result.value = [];
  try {
    const res = await aiApi.recommendBooks({ preferences: preferences.value, exclude: exclude.value });
    result.value = res.data?.data?.books || res.data?.data || [];
  } catch (e) {
    error.value = e?.message || '推荐失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ai-recommend { max-width: 500px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.form-group { margin-bottom: 1rem; }
.error-tip { color: #e74c3c; margin-top: 1rem; }
</style>
