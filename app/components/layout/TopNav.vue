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

        <!-- 로그인 상태에 따른 버튼 표시 -->
        <div v-if="isLoggedIn" class="flex items-center gap-3 border-l pl-3">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ user?.email }}
          </span>
          <UiButton
            @click="handleLogout"
            :disabled="isLoading"
            class="bg-red-600 hover:bg-red-700"
          >
            로그아웃
          </UiButton>
        </div>
        <UiButton v-else @click="isLoginOpen = true">
          로그인
        </UiButton>
      </div>
    </div>

    <div class="mx-auto w-full px-6 pb-3 md:hidden">
      <CategoryTabs />
    </div>
  </header>

  <UiExplainModal v-model="isExplainOpen" />
  <UiLoginModal :isOpen="isLoginOpen" @close="isLoginOpen = false" />
</template>

<script setup lang="ts">
import CategoryTabs from '~/components/layout/CategoryTabs.vue'

const { isDark, toggle } = useDarkMode()
const { user, isLoggedIn, isLoading, logout } = useAuth()

const isExplainOpen = ref(false)
const isLoginOpen = ref(false)

const handleLogout = async () => {
  await logout()
}
</script>
