<template>
  <!-- 로그인 모달 -->
  <div
    v-if="isOpen && !showSignup"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">로그인</h3>

      <div class="space-y-3 mb-6">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            이메일
          </label>
          <input
            v-model="loginForm.email"
            type="email"
            class="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            비밀번호
          </label>
          <input
            v-model="loginForm.password"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="비밀번호"
          />
        </div>
      </div>

      <!-- 에러 메시지 표시 -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ error }}
      </div>

      <div class="flex justify-end gap-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          :disabled="isLoading"
        >
          취소
        </button>
        <button
          @click="handleLogin"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </div>

      <!-- 회원가입 링크 -->
      <div class="mt-4 text-center text-sm">
        <span class="text-gray-600 dark:text-gray-400">
          계정이 없으신가요?
        </span>
        <button
          @click="showSignup = true"
          class="ml-1 text-blue-700 hover:underline dark:text-blue-400"
        >
          회원가입
        </button>
      </div>
    </div>
  </div>

  <!-- 회원가입 모달 -->
  <div
    v-if="isOpen && showSignup"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">회원가입</h3>

      <div class="space-y-3 mb-6">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            이메일
          </label>
          <input
            v-model="signupForm.email"
            type="email"
            class="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            비밀번호 (6자 이상)
          </label>
          <input
            v-model="signupForm.password"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="비밀번호"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            비밀번호 확인
          </label>
          <input
            v-model="signupForm.passwordConfirm"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="비밀번호 확인"
          />
        </div>
      </div>

      <!-- 에러 메시지 표시 -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ error }}
      </div>

      <div class="flex justify-end gap-2">
        <button
          @click="showSignup = false"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          :disabled="isLoading"
        >
          뒤로
        </button>
        <button
          @click="handleSignup"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {{ isLoading ? '가입 중...' : '회원가입' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const { isLoading, error, login, signup } = useAuth()

const showSignup = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const signupForm = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
})

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      showSignup.value = false
      loginForm.email = ''
      loginForm.password = ''
      signupForm.email = ''
      signupForm.password = ''
      signupForm.passwordConfirm = ''
    }
  },
)

const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    return
  }

  const result = await login(loginForm.email, loginForm.password)

  if (result.success) {
    emit('close')
  }
}

const handleSignup = async () => {
  if (!signupForm.email || !signupForm.password || !signupForm.passwordConfirm) {
    return
  }

  if (signupForm.password !== signupForm.passwordConfirm) {
    return
  }

  const result = await signup(signupForm.email, signupForm.password)

  if (result.success) {
    emit('close')
  }
}
</script>
