// 该文件为空的原因：
// 1. 你可能误删了内容，或初始 scaffold 时未补充内容。
// 2. 路由指向 AuthLayout 时，页面只渲染了一个空白区域。

// 建议补充如下基础结构，保证登录/注册等页面能正常显示：

<template>
  <div class="auth-layout">
    <div class="auth-card">
      <slot />
    </div>
  </div>
</template>
<script>
export default { name: 'AuthLayout' }
</script>
<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
}
.auth-card {
  min-width: 340px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem;
}
</style>
