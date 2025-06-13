<template>
  <div class="circle-detail" v-if="group">
    <div class="circle-header">
      <div class="circle-info">
        <h2 class="circle-title">{{ group.name }}</h2>
        <div class="circle-meta">
          <span class="circle-founder">圈主：{{ group.founder_name || group.founder?.account || group.founder_id }}</span>
          <span>成员数：{{ group.memberCount || group.member_count || members.length }}</span>
        </div>
        <p class="circle-desc">{{ group.description }}</p>
        <div class="circle-actions">
          <!-- 学生页面 -->
          <template v-if="isStudent">
            <span v-if="isMember" class="joined-tip">已加入圈子</span>
            <span v-else-if="pending || isPendingMember" class="pending-tip">等待审核中</span>
            <button
              v-else
              class="circle-btn"
              @click="joinGroup"
            >加入圈子</button>
          </template>
          <!-- 老师页面 -->
          <template v-else-if="isTeacher">
            <button class="circle-btn" @click="goCreate">创建圈子</button>
            <button
              v-if="isOwner"
              class="circle-btn"
              @click="goEdit"
            >编辑圈子</button>
            <button
              v-if="isOwner"
              class="circle-btn"
              @click="goReview"
            >成员审核</button>
          </template>
          <button class="circle-btn" @click="goCircleList">返回圈子列表</button>
        </div>
      </div>
    </div>
    <div class="circle-section">
      <!-- 只有圈主能查看圈子成员 -->
      <member-list v-if="isOwner" :members="members" :is-owner="isOwner" :group-id="group.id" />
    </div>
    <div class="circle-section">
      <h3>圈子讨论</h3>
      <!-- 只有圈子成员可以发表讨论 -->
      <div v-if="isMember" class="discussion-create">
        <input v-model="discussionTitle" placeholder="讨论标题" class="discussion-input" />
        <textarea v-model="discussionContent" placeholder="讨论内容" rows="3" class="discussion-textarea"></textarea>
        <button class="circle-btn" @click="submitDiscussion" :disabled="!discussionTitle.trim() || !discussionContent.trim() || submitting">
          {{ submitting ? '发表中...' : '发表讨论' }}
        </button>
        <div v-if="discussionError" class="discussion-error">{{ discussionError }}</div>
        <div v-if="discussionSuccess" class="discussion-success">{{ discussionSuccess }}</div>
      </div>
      <ul class="discussion-list">
        <li v-for="d in discussions" :key="d.id" class="discussion-item">
          <div class="discussion-title-row">
            <span class="discussion-title">{{ d.title }}</span>
            <span class="discussion-meta">
              by {{ d.poster?.account || d.poster_id }}
              <span v-if="d.post_time"> · {{ d.post_time.slice(0,16) }}</span>
            </span>
          </div>
          <div class="discussion-content-preview">{{ d.content ? d.content.slice(0,80) : '' }}</div>
        </li>
        <li v-if="!discussions.length" class="empty-tip">暂无讨论</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import MemberList from '@/components/circles/MemberList.vue'
import circleApi from '@/api/circles.api'
const store = useStore()
const route = useRoute()
const router = useRouter()
const group = computed(() => store.getters['circle/groupDetail'])
const members = computed(() => {
  const arr = store.getters['circle/members']
  return Array.isArray(arr) ? arr : []
})
const user = computed(() => store.state.auth.user)
// 判断是否为学生
const isStudent = computed(() => user.value?.role === 'student')
// 判断是否为老师（教师或导师）
const isTeacher = computed(() => user.value?.role === 'mentor' || user.value?.role === 'teacher')
const isOwner = computed(() => group.value && user.value && group.value.founder_id === user.value.id)
const isMember = computed(() => {
  const arr = Array.isArray(members.value) ? members.value : []
  return arr.some(m => m.id === user.value?.id)
})
// 修正：直接用ref，不用vueRef
const isPendingMember = ref(false)
const fetchAll = async () => {
  // 拉取圈子详情和成员列表
  await store.dispatch('circle/fetchGroupDetail', route.params.id)
  await store.dispatch('circle/fetchMembers', route.params.id)
  // 检查是否为待审核成员
  try {
    const res = await circleApi.getPendingMembers(route.params.id)
    if (res.success && Array.isArray(res.data)) {
      isPendingMember.value = res.data.some(m => m.user_id === user.value?.id)
    } else if (res.success && Array.isArray(res.data?.pendingMembers)) {
      isPendingMember.value = res.data.pendingMembers.some(m => m.user_id === user.value?.id)
    } else {
      isPendingMember.value = false
    }
  } catch {
    isPendingMember.value = false
  }
}
const discussions = ref([])
const discussionsLoading = ref(false)
const discussionsError = ref('')
const fetchDiscussions = async () => {
  discussionsLoading.value = true
  discussionsError.value = ''
  try {
    const res = await circleApi.getDiscussions(group.value.id)
    discussions.value = res.data?.data?.discussions || res.data?.discussions || []
  } catch (e) {
    discussionsError.value = e?.response?.data?.error || e?.message || '加载失败'
  } finally {
    discussionsLoading.value = false
  }
}
onMounted(async () => {
  await fetchAll()
  await fetchDiscussions()
})
const joinGroup = async () => {
  // 学生点击加入圈子，调用API
  try {
    await circleApi.joinGroup(group.value.id)
    pending.value = true
    await fetchAll() // 加入后刷新状态
  } catch (e) {
    alert(e?.response?.data?.error || e?.message || '加入失败')
  }
}
const goCreate = () => router.push('/circle/create')
const goEdit = () => router.push(`/circle/edit/${group.value.id}`)
const goReview = () => router.push(`/circle/${group.value.id}/review`)
const goCircleList = () => router.push('/circle')
const goMembers = () => router.push(`/circle/${group.value.id}/members`)
const discussionTitle = ref('')
const discussionContent = ref('')
const submitting = ref(false)
const discussionError = ref('')
const discussionSuccess = ref('')
const submitDiscussion = async () => {
  discussionError.value = ''
  discussionSuccess.value = ''
  if (!discussionTitle.value.trim() || !discussionContent.value.trim()) {
    discussionError.value = '标题和内容不能为空'
    return
  }
  submitting.value = true
  try {
    await circleApi.createDiscussion(group.value.id, {
      title: discussionTitle.value,
      content: discussionContent.value
    })
    discussionSuccess.value = '讨论发表成功！'
    discussionTitle.value = ''
    discussionContent.value = ''
    await fetchDiscussions()
  } catch (e) {
    discussionError.value = e?.response?.data?.error || e?.message || '发表失败'
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>
.circle-detail {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  padding: 2rem;
}
.circle-header {
  display: flex;
}
.circle-info {
  flex: 1;
}
.circle-title {
  font-size: 2rem;
  font-weight: bold;
  color: #22223b;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}
.circle-meta {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1.5rem;
}
.circle-founder {
  color: #409eff;
}
.circle-desc {
  margin-bottom: 1.2rem;
  font-size: 1.08rem;
  color: #22223b;
}
.circle-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.circle-btn {
  background: linear-gradient(90deg,#409eff 60%,#6a82fb 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px #e0e7ff;
  transition: background 0.2s, box-shadow 0.2s;
}
.circle-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.circle-btn:hover:not(:disabled) {
  background: #337ecc;
}
.danger-btn {
  background: #e74c3c !important;
}
.joined-tip { color: #67c23a; margin-left: 1em; }
.pending-tip { color: #e6a23c; margin-left: 1em; }
.circle-link {
  color: #409eff;
  text-decoration: underline;
  font-size: 1rem;
  margin-right: 0.5rem;
}
.circle-section {
  margin-top: 2rem;
}
.discussion-create {
  margin-bottom: 1.5rem;
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.discussion-input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 1.05rem;
}
.discussion-textarea {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 1.05rem;
  resize: vertical;
}
.discussion-error {
  color: #e74c3c;
  margin-top: 0.5rem;
}
.discussion-success {
  color: #67c23a;
  margin-top: 0.5rem;
}
.discussion-list {
  margin-top: 1.2rem;
  background: #f7f9fa;
  border-radius: 8px;
  padding: 1.2rem 1rem;
}
.discussion-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.discussion-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.discussion-title {
  font-weight: bold;
  color: #22223b;
  font-size: 1.08rem;
}
.discussion-meta {
  color: #888;
  font-size: 0.97rem;
}
.discussion-content-preview {
  color: #22223b;
  margin-top: 0.3rem;
  font-size: 1.01rem;
  line-height: 1.6;
}
.empty-tip {
  color: #aaa;
  text-align: center;
  margin: 1.5rem 0;
}
@media (max-width: 800px) {
  .circle-detail { padding: 1rem; }
  .circle-header { flex-direction: column; gap: 1rem; }
}
</style>
  .circle-header { flex-direction: column; gap: 1rem; }
