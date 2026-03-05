<template>
  <div class="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <div class="border-b bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">전체 ETF 비교</span>
      <span class="ml-2 text-xs text-gray-400 dark:text-gray-500">{{ etfs.length }}개 · 총보수 기준 정렬</span>
    </div>

    <!-- 데스크탑 테이블 -->
    <div class="hidden md:block">
      <table class="w-full text-sm">
        <thead class="border-b bg-gray-50 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th class="px-5 py-3 text-left">순위</th>
            <th class="px-5 py-3 text-left">ETF 명</th>
            <th class="px-5 py-3 text-left">운용사</th>
            <th class="px-5 py-3 text-right">총보수</th>
            <th class="px-5 py-3 text-right">현재가</th>
            <th class="px-5 py-3 text-right">순자산</th>
            <th class="px-5 py-3 text-right">3개월 수익률</th>
            <th class="px-5 py-3 text-right">당일 등락</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr
            v-for="(etf, i) in etfs"
            :key="etf.itemcode"
            :class="i === 0 ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            <td class="px-5 py-4">
              <span v-if="i === 0" class="text-base">🥇</span>
              <span v-else-if="i === 1" class="text-base">🥈</span>
              <span v-else-if="i === 2" class="text-base">🥉</span>
              <span v-else class="text-xs text-gray-400 dark:text-gray-500">{{ i + 1 }}</span>
            </td>
            <td class="px-5 py-4">
              <a
                :href="`https://finance.naver.com/item/main.naver?code=${etf.itemcode}`"
                target="_blank"
                rel="noopener"
                class="font-medium text-gray-900 hover:text-blue-600 hover:underline dark:text-gray-100 dark:hover:text-blue-400"
              >
                {{ etf.name }}
              </a>
            </td>
            <td class="px-5 py-4 text-gray-500 dark:text-gray-400">{{ etf.provider }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center justify-end gap-2">
                <div class="w-20">
                  <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      class="h-1.5 rounded-full"
                      :class="i === 0 ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'"
                      :style="{ width: feeBarWidth(etf.fee) }"
                    />
                  </div>
                </div>
                <span :class="['tabular-nums font-semibold', i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300']">
                  {{ pct(etf.fee) }}
                </span>
              </div>
            </td>
            <td class="px-5 py-4 text-right tabular-nums text-gray-800 dark:text-gray-200">
              <template v-if="etf.nowVal > 0">
                <div class="font-medium">{{ etf.nowVal.toLocaleString() }}원</div>
                <div class="text-xs" :class="returnColor(etf.changeRate)">
                  {{ etf.changeVal > 0 ? '+' : '' }}{{ etf.changeVal.toLocaleString() }}
                </div>
              </template>
              <template v-else>-</template>
            </td>
            <td class="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-gray-400">
              {{ etf.marketSum > 0 ? formatAum(etf.marketSum) : '-' }}
            </td>
            <td class="px-5 py-4 text-right tabular-nums" :class="returnColor(etf.threeMonthReturn)">
              {{ etf.threeMonthReturn !== 0 ? formatReturn(etf.threeMonthReturn) : '-' }}
            </td>
            <td class="px-5 py-4 text-right tabular-nums" :class="returnColor(etf.changeRate)">
              {{ etf.changeRate !== 0 ? formatReturn(etf.changeRate) : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 모바일 카드 -->
    <div class="divide-y dark:divide-gray-700 md:hidden">
      <div
        v-for="(etf, i) in etfs"
        :key="etf.itemcode"
        :class="['p-4', i === 0 ? 'bg-blue-50/40 dark:bg-blue-950/20' : '']"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-sm">
                <template v-if="i === 0">🥇</template>
                <template v-else-if="i === 1">🥈</template>
                <template v-else-if="i === 2">🥉</template>
                <template v-else>{{ i + 1 }}위</template>
              </span>
              <span :class="['font-semibold', i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200']">
                {{ etf.name }}
              </span>
            </div>
            <div class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ etf.provider }}</div>
          </div>
          <div class="text-right">
            <div :class="['font-bold tabular-nums', i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300']">
              {{ pct(etf.fee) }}
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500">총보수</div>
          </div>
        </div>
        <div class="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="etf.nowVal > 0" class="font-medium text-gray-700 dark:text-gray-300">
            {{ etf.nowVal.toLocaleString() }}원
            <span :class="returnColor(etf.changeRate)">
              ({{ etf.changeVal > 0 ? '+' : '' }}{{ etf.changeVal.toLocaleString() }})
            </span>
          </span>
          <span v-if="etf.marketSum > 0">순자산 {{ formatAum(etf.marketSum) }}</span>
          <span v-if="etf.threeMonthReturn !== 0" :class="returnColor(etf.threeMonthReturn)">
            3개월 {{ formatReturn(etf.threeMonthReturn) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { pct, formatAum, formatReturn, returnColor } = useEtfFormat()

const props = defineProps<{
  etfs: Array<{
    itemcode: string
    name: string
    provider: string
    fee: number
    nowVal: number
    changeVal: number
    changeRate: number
    marketSum: number
    threeMonthReturn: number
  }>
}>()

const maxFee = computed(() => {
  const fees = props.etfs.map((e) => e.fee)
  return Math.max(...fees) || 1
})

const feeBarWidth = (fee: number) =>
  Math.max(2, (fee / maxFee.value) * 100).toFixed(1) + '%'
</script>
