<template>
  <div class="ui-loading">
    <span class="spinner"></span>
    <span class="text"><slot>加载中...</slot></span>
  </div>
</template>
<script>
export default { name: 'UILoading' }
</script>
<style scoped>
.ui-loading { display: flex; align-items: center; justify-content: center; color: #409eff; }
.spinner {
  width: 18px; height: 18px; border: 2px solid #409eff; border-top: 2px solid #fff;
  border-radius: 50%; margin-right: 8px; animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
