<template>
  <div class="rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <!-- 헤더 -->
    <div class="border-b bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">💰 실비용 계산기</span>
      <span class="ml-2 text-xs text-gray-400 dark:text-gray-500">투자금액 기준 연간·10년 수수료 비교</span>
    </div>

    <!-- 입력 -->
    <div class="flex flex-wrap items-center gap-3 px-5 py-4">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">투자금액</label>
      <div class="flex items-center gap-2">
        <input
          v-model="rawInput"
          type="text"
          inputmode="numeric"
          class="w-44 rounded-lg border border-gray-300 px-3 py-2 text-right text-sm tabular-nums focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="10,000,000"
          @input="onInput"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">원</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          class="rounded-full border px-3 py-1 text-xs transition-colors"
          :class="amount === preset.value
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400'"
          @click="setPreset(preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- 결과 테이블 (데스크탑) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-y bg-gray-50 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th class="px-5 py-3 text-left">ETF 명</th>
            <th class="px-5 py-3 text-right">총보수</th>
            <th class="px-5 py-3 text-right">연간 수수료</th>
            <th class="px-5 py-3 text-right">10년 수수료</th>
            <th class="px-5 py-3 text-right">1위 대비 손실액 (10년)</th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-700">
          <tr
            v-for="(row, i) in rows"
            :key="row.itemcode"
            :class="i === 0 ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            <td class="px-5 py-3 font-medium" :class="i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'">
              <span class="mr-1.5 text-xs">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}위` }}</span>
              {{ row.name }}
            </td>
            <td class="px-5 py-3 text-right tabular-nums text-gray-600 dark:text-gray-400">{{ pct(row.fee) }}</td>
            <td class="px-5 py-3 text-right tabular-nums" :class="i === 0 ? 'font-semibold text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">
              {{ formatWon(row.annualCost) }}
            </td>
            <td class="px-5 py-3 text-right tabular-nums" :class="i === 0 ? 'font-semibold text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">
              {{ formatWon(row.tenYearCost) }}
            </td>
            <td class="px-5 py-3 text-right tabular-nums">
              <span v-if="i === 0" class="text-xs text-blue-500 dark:text-blue-400">최저비용</span>
              <span v-else class="font-semibold text-red-500 dark:text-red-400">+{{ formatWon(row.extraCost) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 모바일 카드 -->
    <div class="divide-y dark:divide-gray-700 md:hidden">
      <div
        v-for="(row, i) in rows"
        :key="row.itemcode"
        class="px-4 py-3"
        :class="i === 0 ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''"
      >
        <div class="flex items-center justify-between">
          <div :class="['font-medium text-sm', i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200']">
            <span class="mr-1 text-xs">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}위` }}</span>
            {{ row.name }}
          </div>
          <span v-if="i === 0" class="text-xs text-blue-500 dark:text-blue-400">최저비용</span>
          <span v-else class="text-xs font-semibold text-red-500 dark:text-red-400">+{{ formatWon(row.extraCost) }} (10년)</span>
        </div>
        <div class="mt-1.5 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>총보수 <b class="text-gray-700 dark:text-gray-300">{{ pct(row.fee) }}</b></span>
          <span>연간 <b :class="i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">{{ formatWon(row.annualCost) }}</b></span>
          <span>10년 <b :class="i === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">{{ formatWon(row.tenYearCost) }}</b></span>
        </div>
      </div>
    </div>

    <!-- 안내 -->
    <div class="border-t px-5 py-3 dark:border-gray-700">
      <p class="text-xs text-gray-400 dark:text-gray-600">
        * 수익률 변동은 반영하지 않으며, 총보수만 기준으로 단순 계산합니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { pct } = useEtfFormat()

const props = defineProps<{
  etfs: Array<{
    itemcode: string
    name: string
    fee: number
  }>
}>()

const DEFAULT_AMOUNT = 10_000_000

const amount = ref(DEFAULT_AMOUNT)
const rawInput = ref(DEFAULT_AMOUNT.toLocaleString())

const presets = [
  { label: '100만', value: 1_000_000 },
  { label: '1,000만', value: 10_000_000 },
  { label: '1억', value: 100_000_000 },
  { label: '10억', value: 1_000_000_000 },
]

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  const num = parseInt(raw, 10)
  if (!isNaN(num)) {
    amount.value = num
    rawInput.value = num.toLocaleString()
  } else {
    amount.value = 0
    rawInput.value = ''
  }
}

function setPreset(value: number) {
  amount.value = value
  rawInput.value = value.toLocaleString()
}

const minFee = computed(() => Math.min(...props.etfs.map((e) => e.fee)))

const rows = computed(() =>
  props.etfs.map((etf) => {
    const annualCost = Math.round(amount.value * etf.fee)
    const tenYearCost = annualCost * 10
    const extraCost = Math.round(amount.value * (etf.fee - minFee.value)) * 10
    return { ...etf, annualCost, tenYearCost, extraCost }
  }),
)

function formatWon(n: number) {
  if (n >= 100_000_000) return (n / 100_000_000).toFixed(2) + '억원'
  if (n >= 10_000) return (n / 10_000).toFixed(1) + '만원'
  return n.toLocaleString() + '원'
}
</script>
