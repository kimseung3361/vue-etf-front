<template>
  <div class="rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <!-- 헤더 -->
    <div class="border-b bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">📈 복리 효과 시뮬레이터</span>
      <span class="ml-2 text-xs text-gray-400 dark:text-gray-500">수수료 차이가 장기 복리로 얼마나 커지는지 확인</span>
    </div>

    <!-- 컨트롤 -->
    <div class="flex flex-wrap items-center gap-4 px-5 py-4">
      <!-- 투자금액 -->
      <div class="flex items-center gap-2">
        <label class="shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">투자금액</label>
        <div class="flex gap-1.5">
          <button
            v-for="p in amountPresets"
            :key="p.label"
            class="rounded-full border px-3 py-1 text-xs transition-colors"
            :class="amount === p.value
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300 text-gray-600 hover:border-blue-400 dark:border-gray-600 dark:text-gray-400'"
            @click="amount = p.value"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- 기대수익률 -->
      <div class="flex items-center gap-2">
        <label class="shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">기대수익률</label>
        <div class="flex gap-1.5">
          <button
            v-for="r in returnPresets"
            :key="r"
            class="rounded-full border px-3 py-1 text-xs transition-colors"
            :class="returnRate === r
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300 text-gray-600 hover:border-blue-400 dark:border-gray-600 dark:text-gray-400'"
            @click="returnRate = r"
          >
            {{ r }}%
          </button>
        </div>
      </div>

      <!-- 기간 -->
      <div class="flex items-center gap-2">
        <label class="shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">투자기간</label>
        <div class="flex gap-1.5">
          <button
            v-for="y in yearOptions"
            :key="y"
            class="rounded-full border px-3 py-1 text-xs transition-colors"
            :class="years === y
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300 text-gray-600 hover:border-blue-400 dark:border-gray-600 dark:text-gray-400'"
            @click="years = y"
          >
            {{ y }}년
          </button>
        </div>
      </div>
    </div>

    <!-- 차트 -->
    <div class="px-5 pb-2">
      <canvas ref="chartRef" height="280" />
    </div>

    <!-- 결과 요약 -->
    <div v-if="summary" class="mx-5 mb-4 rounded-lg bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
      <p class="text-sm text-amber-800 dark:text-amber-300">
        <span class="font-bold">{{ years }}년 후</span>
        최저비용 <span class="font-semibold text-blue-700 dark:text-blue-300">{{ summary.bestName }}</span>과
        최고비용 <span class="font-semibold text-red-600 dark:text-red-400">{{ summary.worstName }}</span> 의 자산 차이:
        <span class="ml-1 font-bold text-red-600 dark:text-red-400">{{ formatWon(summary.diff) }}</span>
      </p>
    </div>

    <!-- 범례 -->
    <div class="flex flex-wrap gap-3 px-5 pb-4">
      <div v-for="(etf, i) in etfs" :key="etf.itemcode" class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-5 rounded-full" :style="{ backgroundColor: COLORS[i] ?? '#94a3b8' }" />
        <span class="text-xs text-gray-600 dark:text-gray-400">{{ etf.name }}</span>
      </div>
    </div>

    <div class="border-t px-5 py-3 dark:border-gray-700">
      <p class="text-xs text-gray-400 dark:text-gray-600">
        * 기대수익률(세전)에서 수수료를 차감한 순수익으로 복리 계산합니다. 실제 수익률은 다를 수 있습니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

const props = defineProps<{
  etfs: Array<{
    itemcode: string
    name: string
    provider: string
    fee: number
  }>
}>()

// ETF 인덱스 순서대로 사용할 라인 색상 (0번=최저비용=파란색)
const COLORS = ['#3b82f6', '#94a3b8', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

// 투자금액 프리셋 버튼 목록
const amountPresets = [
  { label: '1,000만', value: 10_000_000 },
  { label: '5,000만', value: 50_000_000 },
  { label: '1억', value: 100_000_000 },
]
// 기대수익률(%) 선택지
const returnPresets = [5, 7, 10]
// 투자기간(년) 선택지
const yearOptions = [10, 20, 30]

// 사용자 입력값 상태
const amount = ref(10_000_000)
const returnRate = ref(7)
const years = ref(30)

// Chart.js 캔버스 DOM 참조 및 인스턴스
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// 특정 수수료·연도 기준 복리 후 자산가치 계산
// 공식: 투자금 × (1 + 수익률 - 수수료)^년수
const calcValue = (fee: number, year: number) =>
  amount.value * Math.pow(1 + returnRate.value / 100 - fee, year)

// 숫자를 억원/만원/원 단위 문자열로 변환
const formatWon = (n: number) => {
  if (n >= 100_000_000) return (n / 100_000_000).toFixed(1) + '억원'
  if (n >= 10_000) return Math.round(n / 10_000) + '만원'
  return Math.round(n).toLocaleString() + '원'
}

// 최저비용(1위) vs 최고비용(꼴찌) 의 N년 후 자산 차이 요약
const summary = computed(() => {
  if (props.etfs.length < 2) return null
  const best = props.etfs[0]
  const worst = props.etfs[props.etfs.length - 1]
  const diff = calcValue(best.fee, years.value) - calcValue(worst.fee, years.value)
  return { bestName: best.name, worstName: worst.name, diff }
})

// Chart.js에 넘길 labels·datasets 생성
// - labels: 5년 단위로만 표시 (0년, 5년, 10년...)
// - datasets: ETF별 연도별 자산가치 배열
const buildChartData = () => {
  const labels = Array.from({ length: years.value + 1 }, (_, i) => (i % 5 === 0 ? `${i}년` : ''))

  const datasets = props.etfs.map((etf, i) => {
    const color = COLORS[i] ?? '#94a3b8'
    const isFirst = i === 0
    return {
      label: etf.name,
      data: Array.from({ length: years.value + 1 }, (_, y) => Math.round(calcValue(etf.fee, y))),
      borderColor: color,
      backgroundColor: isFirst ? color + '18' : 'transparent',
      fill: isFirst,           // 최저비용 ETF만 영역 채우기
      borderWidth: isFirst ? 2.5 : 1.5,
      pointRadius: 0,          // 기본 점 숨김
      pointHoverRadius: 4,     // 호버 시에만 점 표시
      tension: 0.3,
    }
  })

  return { labels, datasets }
}

// Chart.js 인스턴스 생성 및 차트 렌더링
// 다크모드 여부에 따라 그리드·눈금 색상 분기
const renderChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  const isDark = document.documentElement.classList.contains('dark')
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const tickColor = isDark ? '#9ca3af' : '#6b7280'

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: buildChartData(),
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false }, // 같은 X축 위치 전체 툴팁
      plugins: {
        legend: { display: false }, // 커스텀 범례 사용
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatWon(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: tickColor, maxRotation: 0 },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            callback: (val) => formatWon(Number(val)), // Y축 값을 억/만원으로 표시
          },
        },
      },
    },
  })
}

// 투자금액·수익률·기간 변경 시 차트 데이터만 교체하여 재렌더링
watch([amount, returnRate, years], () => {
  if (chartInstance) {
    chartInstance.data = buildChartData()
    chartInstance.update()
  }
})

// 컴포넌트 마운트 시 차트 초기화, 언마운트 시 메모리 해제
onMounted(() => renderChart())
onUnmounted(() => chartInstance?.destroy())
</script>
