<template>
  <div class="ui-empty">
    <slot>暂无数据</slot>
  </div>
</template>
<script>
export default { name: 'UIEmpty' }
</script>
<style scoped>
.ui-empty { color: #aaa; text-align: center; margin: 2rem 0; }
</style>
