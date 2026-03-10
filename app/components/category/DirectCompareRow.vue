<template>
  <div
    class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3"
    :class="highlight ? 'bg-gray-50 dark:bg-gray-800/50' : ''"
  >
    <div class="text-right">
      <slot name="left" />
    </div>
    <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
      <slot name="label">{{ label }}</slot>
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  highlight?: boolean
}>()
</script>
