<template>
  <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
    <select
      v-model="leftModel"
      class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    >
      <option v-for="(etf, i) in etfs" :key="etf.itemcode" :value="i">
        {{ i === 0 ? '🥇 ' : '' }}{{ etf.name }}
      </option>
    </select>

    <span class="text-center text-sm font-bold text-gray-400 dark:text-gray-500">vs</span>

    <select
      v-model="rightModel"
      class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    >
      <option v-for="(etf, i) in etfs" :key="etf.itemcode" :value="i">
        {{ i === 0 ? '🥇 ' : '' }}{{ etf.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  etfs: Array<{ itemcode: string; name: string }>
  leftIdx: number
  rightIdx: number
}>()

const emit = defineEmits<{
  'update:leftIdx': [value: number]
  'update:rightIdx': [value: number]
}>()

const leftModel = computed({
  get: () => props.leftIdx,
  set: v => emit('update:leftIdx', v),
})
const rightModel = computed({
  get: () => props.rightIdx,
  set: v => emit('update:rightIdx', v),
})
</script>
