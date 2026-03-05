<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <LayoutTopNav />
    <main class="w-full px-6 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import LayoutTopNav from '~/components/layout/TopNav.vue'

const { init } = useDarkMode()
onMounted(() => init())
</script>
