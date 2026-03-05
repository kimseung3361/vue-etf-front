<template>
  <div class="mx-auto max-w-4xl space-y-6 px-4 py-6">

    <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
      ← 홈으로
    </NuxtLink>

    <!-- 로딩 -->
    <CategoryLoadingSkeleton v-if="status === 'pending'" />

    <!-- 에러 -->
    <UiErrorState
      v-else-if="error"
      message="데이터를 불러오지 못했습니다."
      :detail="error.message"
      :on-retry="refresh"
    />

    <template v-else-if="data">

      <!-- 헤더 -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ data.label }}</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ data.description }}</p>
      </div>

      <!-- Best Pick 카드 -->
      <CategoryBestPickCard v-if="best" :etf="best" :total-count="data.etfs.length" />

      <!-- 전체 비교 테이블 -->
      <CategoryEtfCompareTable :etfs="data.etfs" />

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

useHead({
  title: data.value ? `${data.value.label} ETF 비교 | TOP ETF` : 'ETF 비교',
})
</script>
