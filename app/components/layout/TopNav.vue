<template>
  <header class="sticky top-0 z-50 border-b bg-white dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto flex w-full items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold">
        <span class="text-lg">🏆</span>
        <span class="text-lg">TOP ETF</span>
      </NuxtLink>

      <CategoryTabs class="hidden md:block" />

      <div class="flex items-center gap-2">
        <UiButton @click="isExplainOpen = true">설명</UiButton>
        <UiButton @click="toggle">{{ isDark ? '☀️' : '🌙' }}</UiButton>
      </div>
    </div>

    <div class="mx-auto w-full px-6 pb-3 md:hidden">
      <CategoryTabs />
    </div>
  </header>

  <UiExplainModal v-model="isExplainOpen" />
</template>

<script setup lang="ts">
import CategoryTabs from '~/components/layout/CategoryTabs.vue'

const { isDark, toggle } = useDarkMode()
const isExplainOpen = ref(false)
</script>
