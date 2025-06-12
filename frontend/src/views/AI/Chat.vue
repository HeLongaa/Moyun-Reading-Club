<template>
  <div class="ai-chat">
    <h2>AI 聊天助手</h2>
    <div class="chat-box">
      <div v-for="(msg, i) in messages" :key="i" :class="['msg', msg.role]">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <form @submit.prevent="send">
      <input v-model="input" placeholder="请输入你的问题..." />
      <button type="submit" :disabled="loading || !input.trim()">发送</button>
    </form>
    <div v-if="loading" class="loading">AI 正在思考...</div>
    <div v-if="error" class="error-tip">{{ error }}</div>
  </div>
</template>
<script>
import http from '@/utils/api'
export default {
  name: 'AIChat',
  data() {
    return {
      input: '',
      messages: [],
      loading: false,
      error: ''
    }
  },
  methods: {
    async send() {
      if (!this.input.trim()) return
      this.loading = true
      this.error = ''
      this.messages.push({ role: 'user', content: this.input })
      try {
        const res = await http.post('/public/chat', { prompt: this.input })
        const reply = res.data?.data?.response || res.data?.response || 'AI无回复'
        this.messages.push({ role: 'ai', content: reply })
        this.input = ''
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || 'AI请求失败'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.ai-chat { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 2rem; }
.chat-box { min-height: 120px; margin-bottom: 1rem; }
.msg { margin-bottom: 0.5rem; }
.msg.user { color: #222; }
.msg.ai { color: #409eff; }
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; }
</style>
