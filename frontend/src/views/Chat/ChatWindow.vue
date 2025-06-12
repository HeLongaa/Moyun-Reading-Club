<template>
  <div class="chat-window">
    <div class="chat-header">
      <span>与 {{ partner?.account || partnerId }} 聊天</span>
    </div>
    <div class="chat-messages" ref="msgBox">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error-tip">{{ error }}</div>
      <div v-else>
        <div v-for="msg in messages" :key="msg.id" :class="['msg', msg.sender_id === user.id ? 'self' : 'other']">
          <span class="msg-content">{{ msg.content }}</span>
          <span class="msg-time">{{ msg.send_time?.slice(0,16) }}</span>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="content" @keyup.enter="send" placeholder="输入消息..." />
      <button @click="send" :disabled="!content.trim()">发送</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const store = useStore()
const route = useRoute()
const partnerId = route.params.partnerId
const user = computed(() => store.state.auth.user)
const messages = computed(() => store.getters['chat/messages'](partnerId))
const partner = ref(null)
const content = ref('')
const msgBox = ref(null)
const loading = ref(true)
const error = ref('')
const fetchMessages = async () => {
  loading.value = true
  error.value = ''
  try {
    await store.dispatch('chat/fetchMessages', { partnerId })
    // 假设有API获取聊天对象信息
    // partner.value = await ...
    nextTick(() => { if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('加载聊天消息失败:', e, e?.response)
    if (e?.response?.data?.error) {
      error.value = e.response.data.error
    } else if (e?.message) {
      error.value = e.message
    } else {
      error.value = '加载失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
onMounted(fetchMessages)
const send = async () => {
  if (!content.value.trim()) return
  try {
    await store.dispatch('chat/sendMessage', { receiver_id: partnerId, content: content.value })
    content.value = ''
    await fetchMessages()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('发送消息失败:', e, e?.response)
    error.value = e?.response?.data?.error || e?.message || '发送失败，请稍后重试'
  }
}
</script>
<style scoped>
.chat-window { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px #eee; padding: 1rem; display: flex; flex-direction: column; }
.chat-header { font-weight: bold; margin-bottom: 1rem; }
.chat-messages { flex: 1; min-height: 300px; max-height: 400px; overflow-y: auto; margin-bottom: 1rem; }
.msg { margin-bottom: 0.5rem; }
.msg.self { text-align: right; }
.msg-content { display: inline-block; background: #409eff; color: #fff; border-radius: 4px; padding: 0.3rem 1rem; margin: 0 0.5rem; }
.msg.other .msg-content { background: #eee; color: #222; }
.msg-time { font-size: 0.85em; color: #888; }
.chat-input { display: flex; gap: 0.5rem; }
input { flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
button { padding: 0.5rem 1.2rem; border-radius: 4px; background: #409eff; color: #fff; border: none; cursor: pointer; }
.loading { text-align: center; color: #888; margin: 2rem 0; }
.error-tip { color: #e74c3c; text-align: center; margin: 2rem 0; }
</style>
