<template>
  <div class="circle-member-review">
    <h2>待审核成员列表</h2>
    <div v-if="loading">加载中...</div>
    <div v-else>
      <div v-if="members.length === 0">暂无待审核成员</div>
      <ul>
        <li v-for="member in members" :key="member.id" class="member-item">
          <span>{{ member.account }}（{{ member.email }}）</span>
          <button @click="reviewMember(member.id, true)">同意</button>
          <button @click="reviewMember(member.id, false)">拒绝</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPendingMembers, reviewMemberApi } from '@/api/circles.api';

const route = useRoute();
const groupId = route.params.id;
const members = ref([]);
const loading = ref(true);

const fetchMembers = async () => {
  loading.value = true;
  try {
    const res = await getPendingMembers(groupId);
    members.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

const reviewMember = async (userId, isOno) => {
  await reviewMemberApi(groupId, userId, isOno);
  await fetchMembers();
};

onMounted(fetchMembers);
</script>

<style scoped>
.circle-member-review { padding: 24px; }
.member-item { margin-bottom: 12px; }
button { margin-left: 8px; }
</style>
