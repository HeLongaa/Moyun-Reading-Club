<template>
  <button :class="['ui-btn', type]" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
<script>
export default {
  name: 'UIButton',
  props: {
    type: { type: String, default: 'primary' },
    disabled: Boolean
  }
}
</script>
<style scoped>
.ui-btn {
  padding: 0.4rem 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: #409eff;
  color: #fff;
  font-size: 1rem;
}
.ui-btn.primary { background: #409eff; }
.ui-btn.danger { background: #e74c3c; }
.ui-btn:disabled { background: #ccc; cursor: not-allowed; }
</style>
