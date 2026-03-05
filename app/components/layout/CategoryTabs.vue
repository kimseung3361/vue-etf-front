<template>
  <nav class="flex flex-wrap items-center gap-2 text-sm">
    <NuxtLink
      v-for="c in tabs"
      :key="c.code"
      :to="c.to"
      class="rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      :class="isActive(c) ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'"
    >
      {{ c.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const tabs = [
  { code: 'SP500', label: 'S&P 500', to: '/' },
  { code: 'NDX', label: '나스닥 100', to: '/' },
  { code: 'DOWDIV', label: '미국배당다우존스', to: '/' },
  { code: 'K200', label: '코스피200', to: '/' },
  { code: 'USBOND30', label: '미국30년국채', to: '/' },
  { code: 'USTECH10', label: '미국테크TOP10', to: '/' },
  { code: 'CHINASEMI', label: '차이나항셍테크', to: '/' },
  { code: 'INDIA50', label: '인도니프티50', to: '/' }
]

const isActive = (c: any) => {
  return route.path === '/' && c.to === '/'
}
</script>
