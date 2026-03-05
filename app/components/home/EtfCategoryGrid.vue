<template>
  <div>
    <!-- 로딩 스켈레톤 -->
    <section v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="i in 8"
        :key="i"
        class="rounded-xl border bg-white p-5 shadow-md"
      >
        <div class="mb-3 h-3 w-20 animate-pulse rounded bg-gray-200" />
        <div class="mb-1 h-5 w-48 animate-pulse rounded bg-gray-300" />
        <div class="mb-4 h-3 w-28 animate-pulse rounded bg-gray-200" />
        <div class="mb-2 h-2 w-full animate-pulse rounded bg-gray-200" />
        <div class="space-y-3 mt-4">
          <div v-for="j in 2" :key="j" class="h-8 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </section>

    <!-- 에러 -->
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p class="text-red-600 font-medium">데이터를 불러오지 못했습니다.</p>
      <p class="mt-1 text-sm text-red-400">{{ error.message }}</p>
      <button
        class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        @click="refresh()"
      >
        다시 시도
      </button>
    </div>

    <!-- 데이터 -->
    <section v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <HomeEtfCategoryCard
        v-for="c in categories"
        :key="c.code"
        :category="c"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import HomeEtfCategoryCard from '~/components/home/EtfCategoryCard.vue'
import { useHomeCategories } from '~/composables/useHomeCategories'

const { categories, loading, error, refresh } = useHomeCategories()
</script>