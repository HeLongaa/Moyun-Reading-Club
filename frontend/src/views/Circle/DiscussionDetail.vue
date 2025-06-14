<template>
  <div class="discussion-detail">
    <h2>讨论详情</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="!discussion">未找到讨论</div>
    <div v-else>
      <div class="discussion-content">
        <h3>{{ discussion.title }}</h3>
        <p>{{ discussion.content }}</p>
        <div class="meta">作者：{{ discussion.author?.account }} | 发布时间：{{ discussion.created_at }}</div>
        <button v-if="canDelete" @click="deleteDiscussion">删除讨论</button>
      </div>
      <div class="replies">
        <h4>回复</h4>
        <ul>
          <li v-for="reply in replies" :key="reply.id">
            <span>{{ reply.author?.account }}：</span>{{ reply.content }}
            <span class="meta">{{ reply.created_at }}</span>
          </li>
        </ul>
        <div v-if="replies.length === 0">暂无回复</div>
        <form @submit.prevent="submitReply" class="reply-form">
          <textarea v-model="replyContent" placeholder="输入回复内容..." required></textarea>
          <button type="submit">回复</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDiscussionDetail, getDiscussionReplies, replyDiscussion, deleteDiscussionApi } from '@/api/circles.api';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();
const groupId = route.params.id;
const discussionId = route.params.discussionId;
const discussion = ref(null);
const replies = ref([]);
const loading = ref(true);
const replyContent = ref('');
const user = computed(() => store.state.auth.user);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const res = await getDiscussionDetail(groupId, discussionId);
    discussion.value = res.data;
    const replyRes = await getDiscussionReplies(groupId, discussionId);
    replies.value = replyRes.data || [];
  } finally {
    loading.value = false;
  }
};

const submitReply = async () => {
  await replyDiscussion(groupId, discussionId, { content: replyContent.value });
  replyContent.value = '';
  await fetchDetail();
};

const canDelete = computed(() => user.value && (user.value.id === discussion.value?.author?.id || user.value.role === 'admin'));
const deleteDiscussion = async () => {
  if (confirm('确定删除该讨论？')) {
    await deleteDiscussionApi(groupId, discussionId);
    router.push(`/circle/${groupId}`);
  }
};

onMounted(fetchDetail);
</script>

<style scoped>
.discussion-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px #eee;
  padding: 2rem;
}
.discussion-content {
  margin-bottom: 2rem;
}
.meta {
  color: #888;
  font-size: 0.9em;
  margin-left: 1em;
}
.replies ul {
  padding-left: 0;
  list-style: none;
}
.reply-form {
  margin-top: 1rem;
}
.reply-form textarea {
  width: 100%;
  min-height: 60px;
  margin-bottom: 0.5rem;
}
</style>
