<template>
  <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
    <div
      class="h-2 rounded-full"
      :class="subtle ? 'bg-gray-500 dark:bg-gray-400' : 'bg-blue-600'"
      :style="{ width: widthPct + '%' }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number
  max: number
  subtle?: boolean
}>()

const widthPct = computed(() => {
  if (!props.max) return 0
  const pct = (props.value / props.max) * 100
  return Math.max(2, Math.min(100, pct))
})
</script>
