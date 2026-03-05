<template>
  <article class="rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
    <div class="text-sm text-gray-500 dark:text-gray-400">{{ category.label }}</div>

    <div class="mt-1">
      <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ category.top.name }}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">{{ category.top.provider }}</div>
    </div>

    <div class="mt-4 space-y-2">
      <div class="text-sm">
        실부담비용: <span class="font-semibold">{{ pct(category.top.fee) }}</span>
      </div>
      <HomeFeeBar :value="category.top.fee" :max="maxFee" />

      <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">다른 ETF의 실부담비용</div>

      <div v-for="e in category.others" :key="e.name" class="mt-2">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ e.name }}</span>
          <span class="tabular-nums text-gray-500 dark:text-gray-400">{{ pct(e.fee) }}</span>
        </div>
        <HomeFeeBar :value="e.fee" :max="maxFee" subtle />
      </div>
    </div>

    <div class="mt-4">
      <NuxtLink
        :to="`/category/${category.code}`"
        class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        자세히 비교하기 →
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import HomeFeeBar from '~/components/home/FeeBar.vue'
import type { EtfCategory } from '~/composables/useHomeCategories'

const props = defineProps<{ category: EtfCategory }>()

const maxFee = computed(() => {
  const all = [props.category.top, ...props.category.others]
  return Math.max(...all.map(i => i.fee))
})

const pct = (fee: number) => (fee * 100).toFixed(3) + '%'
</script>
