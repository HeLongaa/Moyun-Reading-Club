<template>
  <div class="comment-detail">
    <h2>评论详情</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="!comment">未找到评论</div>
    <div v-else>
      <div class="comment-content">
        <div class="meta">作者：{{ comment.author?.account || comment.author_id }} | {{ comment.publish_time }}</div>
        <div class="content">{{ comment.content }}</div>
        <div class="actions">
          <button @click="likeComment" :disabled="comment.liked">👍 {{ comment.likeCount || 0 }}</button>
          <button @click="showReplyBox = !showReplyBox">回复</button>
        </div>
        <div v-if="showReplyBox" class="reply-box">
          <textarea v-model="replyText" placeholder="写下你的回复..." rows="3"></textarea>
          <button @click="submitReply" :disabled="!replyText.trim()">提交</button>
        </div>
      </div>
      <div class="replies-section">
        <h3>回复</h3>
        <ul>
          <li v-for="r in replies" :key="r.id" class="reply-item">
            <div class="reply-meta">
              <span class="author">{{ r.author?.account || r.author_id }}</span>
              <span class="time">{{ r.publish_time }}</span>
            </div>
            <div class="reply-content">{{ r.content }}</div>
            <button @click="likeReply(r)" :disabled="r.liked">👍 {{ r.likeCount || 0 }}</button>
            <button @click="toggleNestedReply(r.id)">回复</button>
            <div v-if="nestedReplyBox[r.id]" class="nested-reply-box">
              <textarea v-model="nestedReplyText[r.id]" placeholder="回复..." rows="2"></textarea>
              <button @click="submitNestedReply(r.id)" :disabled="!nestedReplyText[r.id]?.trim()">提交</button>
            </div>
            <ul v-if="r.replies && r.replies.length" class="nested-replies">
              <li v-for="nr in r.replies" :key="nr.id">
                <span class="author">{{ nr.author?.account || nr.author_id }}</span>：{{ nr.content }}
                <span class="time">{{ nr.publish_time }}</span>
                <button @click="likeReply(nr)" :disabled="nr.liked">👍 {{ nr.likeCount || 0 }}</button>
              </li>
            </ul>
          </li>
          <li v-if="!replies.length" class="empty-tip">暂无回复</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import commentsApi from '@/api/comments.api';

const route = useRoute();
const commentId = route.params.id;
const comment = ref(null);
const replies = ref([]);
const loading = ref(true);
const showReplyBox = ref(false);
const replyText = ref('');
const nestedReplyBox = reactive({});
const nestedReplyText = reactive({});

const fetchDetail = async () => {
  loading.value = true;
  try {
    const res = await commentsApi.getCommentDetail(commentId);
    comment.value = res.data?.data || res.data || {};
    replies.value = comment.value.replies || [];
  } finally {
    loading.value = false;
  }
};

const likeComment = async () => {
  await commentsApi.interact(commentId, 'like');
  comment.value.liked = true;
  comment.value.likeCount = (comment.value.likeCount || 0) + 1;
};

const submitReply = async () => {
  await commentsApi.replyComment(commentId, { content: replyText.value });
  replyText.value = '';
  showReplyBox.value = false;
  await fetchDetail();
};

const toggleNestedReply = (id) => {
  nestedReplyBox[id] = !nestedReplyBox[id];
};

const submitNestedReply = async (id) => {
  await commentsApi.replyComment(id, { content: nestedReplyText[id] });
  nestedReplyText[id] = '';
  nestedReplyBox[id] = false;
  await fetchDetail();
};

const likeReply = async (r) => {
  await commentsApi.interact(r.id, 'like');
  r.liked = true;
  r.likeCount = (r.likeCount || 0) + 1;
};

onMounted(fetchDetail);
</script>

<style scoped>
.comment-detail { max-width: 700px; margin: 2rem auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 2rem; }
.comment-content { margin-bottom: 2rem; }
.meta, .reply-meta { color: #888; font-size: 0.98rem; margin-bottom: 0.5rem; }
.actions { margin-bottom: 1rem; }
.reply-box, .nested-reply-box { margin-bottom: 1rem; }
.reply-box textarea, .nested-reply-box textarea { width: 100%; border-radius: 4px; border: 1px solid #ccc; padding: 8px; resize: vertical; margin-bottom: 8px; }
.reply-box button, .nested-reply-box button { background: #409eff; color: #fff; border: none; border-radius: 4px; padding: 4px 16px; cursor: pointer; }
.replies-section { margin-top: 2rem; }
.reply-item { border-bottom: 1px solid #eee; padding: 1rem 0; }
.nested-replies { margin-left: 2rem; color: #555; }
.empty-tip { color: #aaa; text-align: center; margin: 1.5rem 0; }
</style>
