<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Mentor"
})
</script>

<template>
  <div class="profile-container">
    <h2>教师中心</h2>
    <div class="profile-main">
      <div class="avatar-section">
        <img :src="avatarUrl" class="avatar" alt="头像" />
        <input type="file" @change="onAvatarChange" accept="image/*" />
        <button v-if="avatarFile" @click="uploadAvatar" :disabled="uploading">{{ uploading ? '上传中...' : '上传头像' }}</button>
      </div>
      <div class="info-section">
        <div class="info-row"><b>用户名：</b>{{ profile.account }}</div>
        <div class="info-row"><b>邮箱：</b>{{ profile.email }}</div>
        <div class="info-row"><b>手机号：</b>{{ profile.telephone }}</div>
        <div class="info-row"><b>个性签名：</b>{{ profile.signature }}</div>
        <div class="info-row"><b>身份：</b>{{ profile.role === 'teacher' ? '教师' : '学生' }}</div>
        <div class="info-row"><b>书评数：</b>{{ stats.journalCount || 0 }}</div>
        <div class="info-row"><b>点赞数：</b>{{ stats.likeCount || 0 }}</div>
        <div class="info-row"><b>评论数：</b>{{ stats.commentCount || 0 }}</div>
        <div class="info-row"><b>圈子数：</b>{{ stats.groupCount || 0 }}</div>
        <button @click="editMode = true">编辑资料</button>
        <button @click="showPwd = true">修改密码</button>
        <router-link to="/books/create" class="primary-btn">发布新书籍</router-link>
      </div>
    </div>
    <!-- 编辑资料弹窗 -->
    <div v-if="editMode" class="modal">
      <div class="modal-content">
        <h3>编辑资料</h3>
        <form @submit.prevent="submitEdit">
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="editForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input v-model="editForm.telephone" required />
          </div>
          <div class="form-group">
            <label>个性签名</label>
            <input v-model="editForm.signature" />
          </div>
          <button type="submit" :disabled="editLoading">保存</button>
          <button type="button" @click="editMode = false">取消</button>
        </form>
        <div v-if="editError" class="error-msg">{{ editError }}</div>
      </div>
    </div>
    <!-- 修改密码弹窗 -->
    <div v-if="showPwd" class="modal">
      <div class="modal-content">
        <h3>修改密码</h3>
        <form @submit.prevent="submitPwd">
          <div class="form-group">
            <label>当前密码</label>
            <input v-model="pwdForm.currentPassword" type="password" required />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input v-model="pwdForm.newPassword" type="password" required />
          </div>
          <button type="submit" :disabled="pwdLoading">保存</button>
          <button type="button" @click="showPwd = false">取消</button>
        </form>
        <div v-if="pwdError" class="error-msg">{{ pwdError }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      editMode: false,
      showPwd: false,
      editForm: {
        email: '',
        telephone: '',
        signature: ''
      },
      editLoading: false,
      editError: null,
      pwdForm: {
        currentPassword: '',
        newPassword: ''
      },
      pwdLoading: false,
      pwdError: null,
      avatarFile: null,
      uploading: false
    }
  },
  computed: {
    ...mapGetters('profile', ['profile', 'stats']),
    avatarUrl() {
      return this.profile?.photo_path || '/profilePhoto/default_avatar.png'
    }
  },
  created() {
    this.fetchProfile()
    this.fetchStats()
  },
  methods: {
    ...mapActions('profile', ['fetchProfile', 'updateProfile', 'uploadPhoto', 'fetchStats']),
    ...mapActions('auth', ['changePassword']),
    onAvatarChange(e) {
      this.avatarFile = e.target.files[0]
    },
    async uploadAvatar() {
      if (!this.avatarFile) return
      this.uploading = true
      const formData = new FormData()
      formData.append('photo', this.avatarFile)
      try {
        await this.uploadPhoto(formData)
        await this.fetchProfile()
        this.avatarFile = null
      } catch (e) {
        alert('头像上传失败')
      } finally {
        this.uploading = false
      }
    },
    editProfile() {
      this.editForm.email = this.profile.email
      this.editForm.telephone = this.profile.telephone
      this.editForm.signature = this.profile.signature
      this.editMode = true
    },
    async submitEdit() {
      this.editLoading = true
      this.editError = null
      try {
        await this.updateProfile(this.editForm)
        await this.fetchProfile()
        this.editMode = false
      } catch (e) {
        this.editError = e.response?.data?.message || '保存失败'
      } finally {
        this.editLoading = false
      }
    },
    async submitPwd() {
      if (!this.pwdForm.currentPassword || !this.pwdForm.newPassword) return
      this.pwdLoading = true
      this.pwdError = null
      try {
        await this.changePassword(this.pwdForm)
        this.showPwd = false
        this.pwdForm.currentPassword = ''
        this.pwdForm.newPassword = ''
        alert('密码修改成功')
      } catch (e) {
        this.pwdError = e.response?.data?.message || '修改失败'
      } finally {
        this.pwdLoading = false
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem;
}
.profile-main {
  display: flex;
  gap: 2rem;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}
.info-section {
  flex: 1;
}
.info-row {
  margin-bottom: 0.5rem;
}
button {
  margin-right: 1rem;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
}
.error-msg {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}
</style>