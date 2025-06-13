<template>
  <div>
    <!-- ...existing template code... -->
  </div>
</template>

<script>
import { getStats } from '@/api/profile.api'

export default {
  data() {
    return {
      // ...existing data properties...
      stats: {},
    }
  },
  async created() {
    try {
      const res = await getStats()
      this.stats = res.data?.data || {}
    } catch (e) {
      // ...existing error handling code...
    }
    // ...existing code...
  },
  methods: {
    // ...existing methods...
  },
}
</script>

<style scoped>
/* ...existing styles... */
</style>