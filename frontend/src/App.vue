<template>
  <div class="app-logo-container">
    <img src="@/assests/images/logo.png" alt="logo" class="app-logo" />
  </div>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.app-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
}
.app-logo {
  height: 80px;
  width: auto;
}
/* ...existing code... */
</style>