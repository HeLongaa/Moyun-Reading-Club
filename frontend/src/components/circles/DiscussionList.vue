<template>
  <div class="discussion-list">
    <div class="discussion-create" v-if="isMember">
      <input v-model="newTitle" placeholder="讨论标题" />
      <textarea v-model="newContent" placeholder="讨论内容"></textarea>
      <button @click="createDiscussion">发布</button>
    </div>
    <div v-for="d in discussions" :key="d.id" class="discussion-item">
      <div class="discussion-header">
        <span class="discussion-title">{{ d.title }}</span>
        <span class="discussion-author">{{ d.authorName }}</span>
        <button v-if="isSelf(d.authorId)" @click="deleteDiscussion(d.id)">删除</button>
      </div>
      <div class="discussion-content">{{ d.content }}</div>
      <div class="discussion-replies">
        <div v-for="r in d.replies" :key="r.id" class="reply-item">
          <span>{{ r.authorName }}：</span>{{ r.content }}
        </div>
        <div v-if="isMember">
          <input v-model="replyContent[d.id]" placeholder="回复..." @keyup.enter="reply(d.id)" />
          <button @click="reply(d.id)">回复</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import circlesApi from '@/api/circles.api'
const props = defineProps({ groupId: [String, Number], isMember: Boolean })
const store = useStore()
const discussions = ref([])
const newTitle = ref('')
const newContent = ref('')
const replyContent = ref({})
const user = store.state.auth.user
const fetchDiscussions = async () => {
  const res = await circlesApi.getDiscussions(props.groupId)
  if (res.success) discussions.value = res.data.discussions || res.data.list || []
}
onMounted(fetchDiscussions)
watch(() => props.groupId, fetchDiscussions)
const createDiscussion = async () => {
  if (!newTitle.value || !newContent.value) return
  await circlesApi.createDiscussion(props.groupId, { title: newTitle.value, content: newContent.value })
  newTitle.value = ''
  newContent.value = ''
  fetchDiscussions()
}
const deleteDiscussion = async (id) => {
  await circlesApi.deleteDiscussion(props.groupId, id)
  fetchDiscussions()
}
const reply = async (discussionId) => {
  const content = replyContent.value[discussionId]
  if (!content) return
  await circlesApi.replyDiscussion(props.groupId, discussionId, { content })
  replyContent.value[discussionId] = ''
  fetchDiscussions()
}
const isSelf = (id) => user && user.id === id
</script>
<style scoped>
.discussion-list { margin-top: 2rem; }
.discussion-create { margin-bottom: 1rem; }
.discussion-item { background: #fafbfc; border-radius: 6px; box-shadow: 0 1px 4px #eee; margin-bottom: 1rem; padding: 1rem; }
.discussion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.discussion-title { font-weight: bold; }
.discussion-author { color: #888; font-size: 0.95rem; }
.discussion-content { margin-bottom: 0.5rem; }
.reply-item { color: #555; font-size: 0.95rem; margin-bottom: 0.2rem; }
input, textarea { width: 100%; margin-bottom: 0.5rem; border-radius: 4px; border: 1px solid #ccc; padding: 0.3rem; }
button { background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 0.3rem 1rem; cursor: pointer; margin-left: 0.5rem; }
</style>
