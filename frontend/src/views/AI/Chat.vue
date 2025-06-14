<template>
  <div class="ai-chat-bg">
    <div class="ai-chat-card">
      <h2>AI 聊天助手</h2>
      <div class="chat-box">
        <div v-for="(msg, idx) in messages" :key="idx" :class="msg.role">
          <span v-if="msg.role==='user'">我：</span>
          <span v-else>AI：</span>
          <span>{{ msg.content }}</span>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="chat-form">
        <input v-model="input" placeholder="请输入你的问题..." />
        <button type="submit" :disabled="loading || !input.trim()">发送</button>
      </form>
      <div v-if="loading" class="loading">AI 正在思考...</div>
      <div v-if="error" class="error-tip">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import aiApi from '@/api/ai.api'

const messages = ref([])
const input = ref('')
const loading = ref(false)
const error = ref('')

const sendMessage = async () => {
  if (!input.value.trim()) return
  const userMsg = { role: 'user', content: input.value }
  messages.value.push(userMsg)
  loading.value = true
  error.value = ''
  try {
    const context = messages.value.map(m => ({ role: m.role, content: m.content }))
    const res = await aiApi.chat({ prompt: input.value, history: context })
    // 调试：打印返回内容
    console.log('AI接口返回:', res)
    // 兼容后端返回结构
    let reply = ''
    // 1. 标准结构
    if (res?.data?.data?.response) reply = res.data.data.response
    // 2. 兼容部分后端返回
    else if (res?.data?.data?.reply) reply = res.data.data.reply
    else if (typeof res?.data?.data === 'string') reply = res.data.data
    else if (res?.data?.reply) reply = res.data.reply
    else if (typeof res?.data === 'string') reply = res.data
    // 3. axios简化返回
    else if (res?.response) reply = res.response
    else if (res?.reply) reply = res.reply
    // 4. 兜底
    else reply = 'AI无回复'
    // 处理空字符串或全空白
    if (!reply || /^\s*$/.test(reply)) reply = 'AI无回复'
    messages.value.push({ role: 'ai', content: reply })
    input.value = ''
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || 'AI请求失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.ai-chat-bg {
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
.ai-chat-card {
  position: relative;
  z-index: 1;
  max-width: 600px;
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
.chat-box { min-height: 180px; margin-bottom: 1rem; }
.user { color: #222; margin-bottom: 0.5rem; }
.ai { color: #409eff; margin-bottom: 0.5rem; }
.chat-form { display: flex; gap: 1rem; }
.chat-form input { flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
.chat-form button {
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; margin-top: 1rem; text-align: center; }
</style>
