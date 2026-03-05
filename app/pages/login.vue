<template>
  <div class="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-center mb-6">로그인</h2>

    <input
      type="email"
      v-model="email"
      placeholder="이메일"
      class="w-full p-3 mb-4 border rounded"
    />
    <input
      type="password"
      v-model="password"
      placeholder="비밀번호"
      class="w-full p-3 mb-4 border rounded"
    />
    <button
      @click="login"
      class="w-full p-3 bg-blue-600 text-white rounded"
    >
      로그인
    </button>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()  // Supabase 클라이언트 가져오기

const email = ref('')
const password = ref('')

const login = async () => {
  const { error } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert(error.message)
  } else {
    alert('로그인 성공!')
  }
}
</script>