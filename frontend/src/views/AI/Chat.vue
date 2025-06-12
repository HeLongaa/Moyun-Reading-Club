<template>
  <div class="ai-chat">
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
    <div v-if="loading">AI 正在思考...</div>
    <div v-if="error" class="error-tip">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import aiApi from '@/api/ai.api';

const messages = ref([]);
const input = ref('');
const loading = ref(false);
const error = ref('');

const sendMessage = async () => {
  if (!input.value.trim()) return;
  messages.value.push({ role: 'user', content: input.value });
  loading.value = true;
  error.value = '';
  try {
    const res = await aiApi.chat({ prompt: input.value });
    const reply = res.data?.data?.reply || res.data?.data || res.data?.reply || 'AI无回复';
    messages.value.push({ role: 'ai', content: reply });
    input.value = '';
  } catch (e) {
    error.value = e?.message || 'AI请求失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ai-chat { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.chat-box { min-height: 180px; margin-bottom: 1rem; }
.user { color: #222; margin-bottom: 0.5rem; }
.ai { color: #409eff; margin-bottom: 0.5rem; }
.chat-form { display: flex; gap: 1rem; }
.chat-form input { flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
.error-tip { color: #e74c3c; margin-top: 1rem; }
</style>
