<template>
  <div class="mt-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 dark:border-gray-600">
    <div class="flex flex-wrap items-center gap-3">
      <span class="shrink-0 text-xs text-gray-500 dark:text-gray-400">투자금액</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="p in presets"
          :key="p.label"
          class="rounded-full border px-2.5 py-0.5 text-xs transition-colors"
          :class="
            amount === p.value
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300 text-gray-600 hover:border-blue-400 dark:border-gray-600 dark:text-gray-400'
          "
          @click="emit('update:amount', p.value)"
        >
          {{ p.label }}
        </button>
      </div>
      <div v-if="feeDiff > 0" class="ml-auto text-right">
        <span class="text-xs text-gray-500 dark:text-gray-400">10년 차이</span>
        <span class="ml-1.5 font-bold text-red-500 dark:text-red-400">{{ formatWon(feeDiff * 10) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  amount: number
  presets: Array<{ label: string; value: number }>
  feeDiff: number
}>()

const emit = defineEmits<{
  'update:amount': [value: number]
}>()

const formatWon = (n: number) => {
  if (n >= 100_000_000) return (n / 100_000_000).toFixed(1) + '억원'
  if (n >= 10_000) return Math.round(n / 10_000) + '만원'
  return n.toLocaleString() + '원'
}
</script>
