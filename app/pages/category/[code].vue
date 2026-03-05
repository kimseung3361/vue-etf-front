<template>
  <div class="mx-auto max-w-4xl space-y-6 px-4 py-6">

    <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
      ← 홈으로
    </NuxtLink>

    <!-- 로딩 -->
    <div v-if="status === 'pending'" class="space-y-4">
      <div class="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div class="h-4 w-80 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      <div class="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      <div class="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
      <p class="font-medium text-red-600 dark:text-red-400">데이터를 불러오지 못했습니다.</p>
      <p class="mt-1 text-sm text-red-400">{{ error.message }}</p>
      <button class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600" @click="refresh()">
        다시 시도
      </button>
    </div>

    <template v-else-if="data">

      <!-- 헤더 -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ data.label }}</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ data.description }}</p>
      </div>

      <!-- Best Pick 카드 -->
      <div v-if="best" class="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40">
        <div class="mb-2 flex items-center gap-2">
          <span class="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">🏆 최저 비용</span>
          <span class="text-xs text-blue-500 dark:text-blue-400">{{ data.etfs.length }}개 ETF 중 1위</span>
        </div>
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-xl font-bold text-blue-700 dark:text-blue-300">{{ best.name }}</div>
            <div class="text-sm text-blue-500 dark:text-blue-400">{{ best.provider }}</div>
            <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              총보수 <span class="font-bold text-blue-800 dark:text-blue-200">{{ pct(best.fee) }}</span>
              <template v-if="best.marketSum > 0">
                · 순자산 <span class="font-semibold">{{ formatAum(best.marketSum) }}</span>
              </template>
            </div>
          </div>
          <a
            :href="`https://finance.naver.com/item/main.naver?code=${best.itemcode}`"
            target="_blank"
            rel="noopener"
            class="shrink-0 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            네이버 금융 →
          </a>
        </div>
      </div>

      <!-- 전체 비교 테이블 -->
      <div class="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div class="border-b bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">전체 ETF 비교</span>
          <span class="ml-2 text-xs text-gray-400 dark:text-gray-500">{{ data.etfs.length }}개 · 총보수 기준 정렬</span>
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
                v-for="(etf, i) in data.etfs"
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
            v-for="(etf, i) in data.etfs"
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

      <!-- 안내 -->
      <p class="text-xs text-gray-400 dark:text-gray-600">
        * 총보수는 네이버 금융 기준이며 운용보수만 포함됩니다. 실부담비용(기타비용+매매수수료 포함)과 다를 수 있습니다.
        순자산·수익률은 네이버 금융 실시간 데이터 기준입니다.
      </p>

    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const code = route.params.code as string

const { data, status, error, refresh } = await useFetch(`/api/etf-category/${code}`)

const best = computed(() => data.value?.etfs?.[0] ?? null)

const maxFee = computed(() => {
  const fees = data.value?.etfs?.map((e) => e.fee) ?? [1]
  return Math.max(...fees)
})

const pct = (fee: number) => (fee * 100).toFixed(3) + '%'

const feeBarWidth = (fee: number) => {
  const max = maxFee.value
  if (!max) return '2%'
  return Math.max(2, (fee / max) * 100).toFixed(1) + '%'
}

const formatAum = (marketSum: number) => {
  // marketSum 단위: 백만원
  const eok = marketSum / 100  // 억원
  if (eok >= 10000) return (eok / 10000).toFixed(1) + '조'
  if (eok >= 1000) return (eok / 1000).toFixed(1) + '천억'
  return eok.toFixed(0) + '억'
}

const formatReturn = (val: number) => (val > 0 ? '+' : '') + val.toFixed(2) + '%'

const returnColor = (val: number) => {
  if (val > 0) return 'text-red-500'
  if (val < 0) return 'text-blue-500'
  return 'text-gray-500'
}

useHead({
  title: data.value ? `${data.value.label} ETF 비교 | TOP ETF` : 'ETF 비교',
})
</script>
