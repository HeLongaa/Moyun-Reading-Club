<template>
  <div class="mention-list-container">
    <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="mention-item"
        @click="selectUser(user)"
    >
      <img :src="user.avatar" class="avatar" />
      <span class="username">{{ user.username }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default: () => []
    },
    searchText: {
      type: String,
      default: ''
    }
  },

  computed: {
    filteredUsers() {
      return this.users.filter(user =>
          user.username.toLowerCase().includes(this.searchText.toLowerCase())
      )
    }
  },

  methods: {
    selectUser(user) {
      this.$emit('mention', user)
    }
  }
}
</script>

<style lang="scss" scoped>
.mention-list-container {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.mention-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>