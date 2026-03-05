<template>
  <div class="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
    <p class="font-medium text-red-600 dark:text-red-400">{{ message }}</p>
    <p v-if="detail" class="mt-1 text-sm text-red-400">{{ detail }}</p>
    <button
      v-if="onRetry"
      class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
      @click="onRetry"
    >
      다시 시도
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  detail?: string
  onRetry?: () => void
}>()
</script>
