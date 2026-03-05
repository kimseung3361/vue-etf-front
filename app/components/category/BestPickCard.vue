<template>
  <div class="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
    <div class="mb-2 flex items-center gap-2">
      <span class="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">🏆 최저 비용</span>
      <span class="text-xs text-blue-500 dark:text-blue-400">{{ totalCount }}개 ETF 중 1위</span>
    </div>
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="text-xl font-bold text-blue-700 dark:text-blue-300">{{ etf.name }}</div>
        <div class="text-sm text-blue-500 dark:text-blue-400">{{ etf.provider }}</div>
        <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          총보수 <span class="font-bold text-blue-800 dark:text-blue-200">{{ pct(etf.fee) }}</span>
          <template v-if="etf.marketSum > 0">
            · 순자산 <span class="font-semibold">{{ formatAum(etf.marketSum) }}</span>
          </template>
        </div>
      </div>
      <a
        :href="`https://finance.naver.com/item/main.naver?code=${etf.itemcode}`"
        target="_blank"
        rel="noopener"
        class="shrink-0 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
      >
        네이버 금융 →
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { pct, formatAum } = useEtfFormat()

defineProps<{
  etf: {
    name: string
    provider: string
    fee: number
    marketSum: number
    itemcode: string
  }
  totalCount: number
}>()
</script>
