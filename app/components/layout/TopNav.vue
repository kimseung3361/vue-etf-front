<template>
  <header class="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto flex w-full items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold">
        <span class="text-lg">🏆</span>
        <span class="text-lg">TOP ETF</span>
      </NuxtLink>

      <CategoryTabs class="hidden md:block" />

      <div class="flex items-center gap-2">
        <button class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">설명</button>
        <button
          class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          @click="toggle"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <div class="mx-auto w-full px-6 pb-3 md:hidden">
      <CategoryTabs />
    </div>
  </header>
</template>

<script setup lang="ts">
import CategoryTabs from '~/components/layout/CategoryTabs.vue'

const { isDark, toggle } = useDarkMode()
</script>
