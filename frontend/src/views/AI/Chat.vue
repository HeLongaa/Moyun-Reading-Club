<template>
  <div class="ai-chat">
    <h2>AI 聊天助手</h2>
    <div class="chat-history-controls">
      <button @click="clearHistory">清空历史</button>
      <button @click="loadHistory">加载历史</button>
    </div>
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, idx) in messages" :key="idx" :class="msg.role">
        <span v-if="msg.role==='user'">我：</span>
        <span v-else>AI：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="chat-form">
      <input v-model="input" :disabled="loading" placeholder="请输入你的问题..." @keyup.enter.exact.prevent="sendMessage" />
      <button type="submit" :disabled="loading || !input.trim()">发送</button>
    </form>
    <div v-if="loading" class="loading-bar">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span> AI 正在思考...
    </div>
    <div v-if="error" class="error-tip">
      {{ error }}
      <button @click="retryLast" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import aiApi from '@/api/ai.api';

const STORAGE_KEY = 'ai_chat_history_v1';
const messages = ref([]);
const input = ref('');
const loading = ref(false);
const error = ref('');
const chatBox = ref(null);
let lastUserMsg = '';

// 加载历史
function loadHistory() {
  const history = localStorage.getItem(STORAGE_KEY);
  if (history) {
    messages.value = JSON.parse(history);
  }
}
// 保存历史
function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value));
}
// 清空历史
function clearHistory() {
  messages.value = [];
  saveHistory();
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });
}

// 发送消息
const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return;
  const userMsg = input.value;
  messages.value.push({ role: 'user', content: userMsg });
  lastUserMsg = userMsg;
  input.value = '';
  loading.value = true;
  error.value = '';
  saveHistory();
  scrollToBottom();
  try {
    // 上下文对话：将历史消息拼接为 prompt
    const context = messages.value.filter(m => m.role === 'user' || m.role === 'ai').map(m => (m.role === 'user' ? '用户：' : 'AI：') + m.content).join('\n');
    const res = await aiApi.chat({ prompt: context });
    const reply = res.data?.data?.response || res.data?.data?.reply || res.data?.data || res.data?.reply || 'AI无回复';
    messages.value.push({ role: 'ai', content: reply });
    saveHistory();
    scrollToBottom();
  } catch (e) {
    error.value = e?.message || 'AI请求失败';
  } finally {
    loading.value = false;
  }
};

// 错误重试
function retryLast() {
  if (lastUserMsg) {
    input.value = lastUserMsg;
    error.value = '';
    sendMessage();
  }
}

// 进入页面自动加载历史
loadHistory();

// 新消息自动滚动
watch(messages, scrollToBottom, { deep: true });
</script>

<style scoped>
.ai-chat { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.chat-history-controls { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
.chat-history-controls button { background: #f2f2f2; border: none; border-radius: 4px; padding: 2px 10px; cursor: pointer; color: #4a4e69; }
.chat-box { min-height: 180px; max-height: 320px; overflow-y: auto; margin-bottom: 1rem; background: #fafbfc; border-radius: 6px; padding: 1rem; }
.user { color: #222; margin-bottom: 0.5rem; }
.ai { color: #409eff; margin-bottom: 0.5rem; }
.chat-form { display: flex; gap: 1rem; }
.chat-form input { flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
.loading-bar { color: #409eff; margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #409eff; margin-right: 2px; animation: blink 1.2s infinite both; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
.error-tip { color: #e74c3c; margin-top: 1rem; }
.retry-btn { background: #fff3f3; color: #e74c3c; border: 1px solid #e74c3c; border-radius: 4px; padding: 2px 8px; margin-left: 8px; cursor: pointer; }
</style>
