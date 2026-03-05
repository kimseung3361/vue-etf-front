<template>
  <nav class="border-b bg-white px-6 py-3 flex justify-between items-center">
    <span class="font-semibold text-lg">My Nuxt App</span>

    <div class="flex gap-3 items-center">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>

      <button
        @click="isOpen = true"
        class="bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Login
      </button>
    </div>
  </nav>

  <!-- Modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white rounded-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">로그인</h3>

      <div class="space-y-3">
        <input class="w-full border rounded px-3 py-2" placeholder="이메일" />
        <input class="w-full border rounded px-3 py-2" placeholder="비밀번호" />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button @click="isOpen = false" class="px-4 py-2 text-gray-600">
          취소
        </button>
        <button class="px-4 py-2 bg-blue-700 text-white rounded">
          로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

const isOpen = ref(false)
</script>