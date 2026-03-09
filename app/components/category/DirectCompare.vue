<template>
  <div class="rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <!-- 헤더 -->
    <div class="border-b bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">⚖️ ETF 직접 비교</span>
      <span class="ml-2 text-xs text-gray-400 dark:text-gray-500">두 ETF를 선택해서 항목별 비교</span>
    </div>

    <!-- ETF 선택 -->
    <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
      <select
        v-model="leftIdx"
        class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        <option v-for="(etf, i) in etfs" :key="etf.itemcode" :value="i">
          {{ i === 0 ? '🥇 ' : '' }}{{ etf.name }}
        </option>
      </select>

      <span class="text-center text-sm font-bold text-gray-400 dark:text-gray-500">vs</span>

      <select
        v-model="rightIdx"
        class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        <option v-for="(etf, i) in etfs" :key="etf.itemcode" :value="i">
          {{ i === 0 ? '🥇 ' : '' }}{{ etf.name }}
        </option>
      </select>
    </div>

    <!-- 비교 그리드 -->
    <div v-if="left && right && leftIdx !== rightIdx" class="px-5 pb-5">

      <!-- ETF 이름 헤더 -->
      <div class="mb-3 grid grid-cols-[1fr_auto_1fr] gap-2 text-center">
        <div class="rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-950/40">
          <div class="text-xs text-blue-500 dark:text-blue-400">{{ left.provider }}</div>
          <div class="font-semibold text-blue-700 dark:text-blue-300 text-sm leading-tight">{{ left.name }}</div>
        </div>
        <div class="flex items-center justify-center">
          <span class="text-xs text-gray-400">항목</span>
        </div>
        <div class="rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-950/40">
          <div class="text-xs text-orange-500 dark:text-orange-400">{{ right.provider }}</div>
          <div class="font-semibold text-orange-700 dark:text-orange-300 text-sm leading-tight">{{ right.name }}</div>
        </div>
      </div>

      <!-- 비교 행들 -->
      <div class="divide-y rounded-lg border dark:divide-gray-700 dark:border-gray-700">

        <!-- 총보수 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3">
          <div class="text-right">
            <span
              class="font-bold tabular-nums"
              :class="left.fee <= right.fee ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ pct(left.fee) }}
              <span v-if="left.fee < right.fee" class="ml-1 text-xs text-blue-500">✓ 저렴</span>
            </span>
            <!-- 수수료 바 (오른쪽 정렬) -->
            <div class="mt-1 flex justify-end">
              <div class="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-700">
                <div class="h-1.5 rounded-full bg-blue-400" :style="{ width: feeBarWidth(left.fee) }" />
              </div>
            </div>
          </div>
          <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">총보수</div>
          <div>
            <span
              class="font-bold tabular-nums"
              :class="right.fee <= left.fee ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ pct(right.fee) }}
              <span v-if="right.fee < left.fee" class="ml-1 text-xs text-orange-500">✓ 저렴</span>
            </span>
            <div class="mt-1">
              <div class="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-700">
                <div class="h-1.5 rounded-full bg-orange-400" :style="{ width: feeBarWidth(right.fee) }" />
              </div>
            </div>
          </div>
        </div>

        <!-- 현재가 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3">
          <div class="text-right tabular-nums text-sm text-gray-700 dark:text-gray-300">
            <template v-if="left.nowVal > 0">
              {{ left.nowVal.toLocaleString() }}원
              <div class="text-xs" :class="returnColor(left.changeRate)">
                {{ left.changeVal > 0 ? '+' : '' }}{{ left.changeVal.toLocaleString() }}
              </div>
            </template>
            <template v-else>-</template>
          </div>
          <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">현재가</div>
          <div class="tabular-nums text-sm text-gray-700 dark:text-gray-300">
            <template v-if="right.nowVal > 0">
              {{ right.nowVal.toLocaleString() }}원
              <div class="text-xs" :class="returnColor(right.changeRate)">
                {{ right.changeVal > 0 ? '+' : '' }}{{ right.changeVal.toLocaleString() }}
              </div>
            </template>
            <template v-else>-</template>
          </div>
        </div>

        <!-- 순자산 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3">
          <div class="text-right tabular-nums text-sm" :class="left.marketSum >= right.marketSum ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'">
            {{ left.marketSum > 0 ? formatAum(left.marketSum) : '-' }}
          </div>
          <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">순자산</div>
          <div class="tabular-nums text-sm" :class="right.marketSum >= left.marketSum ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'">
            {{ right.marketSum > 0 ? formatAum(right.marketSum) : '-' }}
          </div>
        </div>

        <!-- 3개월 수익률 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3">
          <div class="text-right tabular-nums text-sm font-semibold" :class="returnColor(left.threeMonthReturn)">
            {{ left.threeMonthReturn !== 0 ? formatReturn(left.threeMonthReturn) : '-' }}
          </div>
          <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">3개월 수익률</div>
          <div class="tabular-nums text-sm font-semibold" :class="returnColor(right.threeMonthReturn)">
            {{ right.threeMonthReturn !== 0 ? formatReturn(right.threeMonthReturn) : '-' }}
          </div>
        </div>

        <!-- 당일 등락 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3">
          <div class="text-right tabular-nums text-sm" :class="returnColor(left.changeRate)">
            {{ left.changeRate !== 0 ? formatReturn(left.changeRate) : '-' }}
          </div>
          <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">당일 등락</div>
          <div class="tabular-nums text-sm" :class="returnColor(right.changeRate)">
            {{ right.changeRate !== 0 ? formatReturn(right.changeRate) : '-' }}
          </div>
        </div>

        <!-- 연간 수수료 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
          <div class="text-right">
            <span class="tabular-nums text-sm font-semibold" :class="left.fee <= right.fee ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
              {{ formatWon(Math.round(amount * left.fee)) }}
            </span>
          </div>
          <div class="text-center">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">연간 수수료</div>
            <div class="text-xs text-gray-400 dark:text-gray-600">({{ formatWonShort(amount) }} 기준)</div>
          </div>
          <div>
            <span class="tabular-nums text-sm font-semibold" :class="right.fee <= left.fee ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'">
              {{ formatWon(Math.round(amount * right.fee)) }}
            </span>
          </div>
        </div>

        <!-- 10년 수수료 차이 -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
          <div class="text-right tabular-nums text-sm font-semibold" :class="left.fee <= right.fee ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
            {{ formatWon(Math.round(amount * left.fee * 10)) }}
          </div>
          <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">10년 수수료</div>
          <div class="tabular-nums text-sm font-semibold" :class="right.fee <= left.fee ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'">
            {{ formatWon(Math.round(amount * right.fee * 10)) }}
          </div>
        </div>
      </div>

      <!-- 투자금액 변경 + 결론 배너 -->
      <div class="mt-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 dark:border-gray-600">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs text-gray-500 dark:text-gray-400 shrink-0">투자금액</span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="p in amountPresets"
              :key="p.label"
              class="rounded-full border px-2.5 py-0.5 text-xs transition-colors"
              :class="amount === p.value
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 text-gray-600 hover:border-blue-400 dark:border-gray-600 dark:text-gray-400'"
              @click="amount = p.value"
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

    </div>

    <!-- 같은 ETF 선택 시 경고 -->
    <div v-else-if="leftIdx === rightIdx" class="px-5 pb-5 text-center text-sm text-gray-400 dark:text-gray-500">
      서로 다른 ETF를 선택해주세요.
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

// 선택된 ETF 인덱스 (기본: 1위 vs 2위)
const leftIdx = ref(0)
const rightIdx = ref(1)

const left = computed(() => props.etfs[leftIdx.value] ?? null)
const right = computed(() => props.etfs[rightIdx.value] ?? null)

// 투자금액 상태
const amount = ref(10_000_000)
const amountPresets = [
  { label: '1,000만', value: 10_000_000 },
  { label: '5,000만', value: 50_000_000 },
  { label: '1억', value: 100_000_000 },
]

// 연간 수수료 차이 (절댓값)
const feeDiff = computed(() =>
  left.value && right.value
    ? Math.abs(Math.round(amount.value * (left.value.fee - right.value.fee)))
    : 0
)

// 수수료 바 너비 계산 (두 ETF 중 최대값 기준)
const maxFee = computed(() => {
  if (!left.value || !right.value) return 1
  return Math.max(left.value.fee, right.value.fee) || 1
})
const feeBarWidth = (fee: number) =>
  Math.max(4, (fee / maxFee.value) * 100).toFixed(1) + '%'

// 금액 포맷
const formatWon = (n: number) => {
  if (n >= 100_000_000) return (n / 100_000_000).toFixed(1) + '억원'
  if (n >= 10_000) return Math.round(n / 10_000) + '만원'
  return n.toLocaleString() + '원'
}
const formatWonShort = (n: number) => {
  if (n >= 100_000_000) return (n / 100_000_000).toFixed(0) + '억'
  if (n >= 10_000) return Math.round(n / 10_000) + '만'
  return n.toLocaleString()
}
</script>
