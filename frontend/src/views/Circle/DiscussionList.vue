<template>
  <div class="discussion-list-page">
    <div class="header">
      <h2>圈子讨论</h2>
      <el-button type="primary" @click="showCreate = true">新建讨论</el-button>
    </div>
    <el-card v-for="item in discussions" :key="item.id" class="discussion-card" @click="goDetail(item.id)">
      <div class="title">{{ item.title }}</div>
      <div class="meta">
        <span>发帖人：{{ item.poster?.account || '未知' }}</span>
        <span>回复数：{{ item.reply_count }}</span>
        <span>时间：{{ formatTime(item.created_at) }}</span>
      </div>
      <div class="content">{{ item.content }}</div>
    </el-card>
    <el-pagination
      v-if="total > limit"
      :current-page="page"
      :page-size="limit"
      :total="total"
      @current-change="fetchList"
      layout="prev, pager, next">
    </el-pagination>
    <el-dialog title="新建讨论" :visible.sync="showCreate">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" @click="createDiscussion">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import api from '@/api/circles.api';

export default {
  name: 'DiscussionList',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const groupId = route.params.groupId;
    const discussions = ref([]);
    const total = ref(0);
    const page = ref(1);
    const limit = ref(10);
    const showCreate = ref(false);
    const form = ref({ title: '', content: '' });

    const fetchList = async (p = 1) => {
      page.value = p;
      const res = await api.getDiscussions(groupId, { page: page.value, limit: limit.value });
      if (res.success) {
        discussions.value = res.data.discussions;
        total.value = res.data.total;
      }
    };

    const createDiscussion = async () => {
      if (!form.value.title || !form.value.content) {
        ElMessage.warning('请填写标题和内容');
        return;
      }
      const res = await api.createDiscussion(groupId, form.value);
      if (res.success) {
        ElMessage.success('发布成功');
        showCreate.value = false;
        form.value = { title: '', content: '' };
        fetchList();
      }
    };

    const goDetail = (discussionId) => {
      router.push(`/circle/${groupId}/discussions/${discussionId}`);
    };

    const formatTime = (t) => t ? new Date(t).toLocaleString() : '';

    onMounted(() => {
      fetchList();
    });

    return { discussions, total, page, limit, showCreate, form, fetchList, createDiscussion, goDetail, formatTime };
  }
};
</script>

<style scoped>
.discussion-list-page {
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 32px 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.discussion-card {
  margin-bottom: 18px;
  cursor: pointer;
  border-radius: 12px;
  transition: box-shadow 0.2s;
}
.discussion-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}
.meta {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
  display: flex;
  gap: 18px;
}
.content {
  color: #333;
  font-size: 15px;
  line-height: 1.6;
}
</style>
