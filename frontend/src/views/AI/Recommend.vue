<template>
  <div class="ai-recommend-bg">
    <div class="ai-recommend-card">
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
      <div v-if="loading" class="loading">推荐中...</div>
      <div v-if="error" class="error-tip">{{ error }}</div>
      <div v-if="result">
        <h3>推荐结果</h3>
        <div v-if="typeof result === 'string'">
          <pre style="white-space:pre-wrap;">{{ result }}</pre>
        </div>
        <ul v-else-if="Array.isArray(result)">
          <li v-for="book in result" :key="book.id || book.title || book">
            {{ typeof book === 'string' ? book : (book.title || JSON.stringify(book)) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import aiApi from '@/api/ai.api'

const preferences = ref('')
const exclude = ref('')
const loading = ref(false)
const error = ref('')
const result = ref(null)

const submitRecommend = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const res = await aiApi.recommendBooks({ preferences: preferences.value, exclude: exclude.value })
    // 调试：打印返回内容
    console.log('AI推荐接口返回:', res)
    // 兼容后端返回结构
    let rec = ''
    if (res?.data?.data?.recommendations) rec = res.data.data.recommendations
    else if (res?.data?.data?.books) rec = res.data.data.books
    else if (Array.isArray(res?.data?.data)) rec = res.data.data
    else if (typeof res?.data?.data === 'string') rec = res.data.data
    else if (res?.data?.recommendations) rec = res.data.recommendations
    else if (typeof res?.data === 'string') rec = res.data
    else rec = '无推荐结果'
    result.value = rec
  } catch (e) {
    // 兼容超时和后端错误
    if (e.code === 'ECONNABORTED' || (e.message && e.message.includes('timeout'))) {
      error.value = 'AI推荐超时，请稍后重试或简化请求内容'
    } else if (e?.response?.data?.error) {
      error.value = e.response.data.error
    } else if (e?.message) {
      error.value = e.message
    } else {
      error.value = '推荐失败'
    }
    // 打印详细错误便于排查
    console.error('AI推荐异常:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ai-recommend-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  min-height: 100vh; min-width: 100vw;
  background: url('@/assests/images/moyun.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}
.ai-recommend-card {
  position: relative;
  z-index: 1;
  max-width: 500px;
  margin: 3.5rem auto 2.5rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #e0e7ff;
  padding: 2.5rem 2rem 2rem 2rem;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
h2 {
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 1.6rem;
  letter-spacing: 2px;
}
.form-group { margin-bottom: 1rem; }
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  margin-top: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; margin-top: 1rem; text-align: center; }
</style>
