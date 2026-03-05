<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- 배경 오버레이 -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <!-- 모달 본문 -->
        <div class="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

          <!-- 헤더 -->
          <div class="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏆</span>
              <span class="font-bold text-gray-900 dark:text-gray-100">TOP ETF 사용 안내</span>
            </div>
            <button
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              @click="$emit('update:modelValue', false)"
            >
              ✕
            </button>
          </div>

          <!-- 내용 -->
          <div class="space-y-5 px-6 py-5">

            <!-- 소개 -->
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              같은 지수를 추종하는 ETF라도 <span class="font-semibold text-gray-900 dark:text-gray-100">실제 부담 비용</span>은 운용사마다 다릅니다.
              TOP ETF는 이 비용을 한눈에 비교해 가장 유리한 ETF를 찾을 수 있도록 도와줍니다.
            </p>

            <!-- 비용 구조 -->
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">비용 구조</p>
              <div class="space-y-2.5">
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">1</span>
                  <div>
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">총보수 (TER)</p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">운용사가 공시하는 연간 운용 수수료. 보통 광고에 나오는 숫자.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 dark:bg-orange-900 dark:text-orange-300">2</span>
                  <div>
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">기타비용</p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">지수 사용료, 보관료, 감사비용 등 총보수에 포함되지 않는 숨겨진 비용.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-300">3</span>
                  <div>
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">매매수수료</p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">ETF 내부에서 종목을 사고팔 때 발생하는 거래 비용.</p>
                  </div>
                </div>
              </div>
              <div class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950/40">
                <p class="text-xs text-red-700 dark:text-red-300">
                  <span class="font-bold">실부담비용 = 총보수 + 기타비용 + 매매수수료</span><br>
                  총보수만 보고 선택하면 실제로는 더 비쌀 수 있습니다.
                </p>
              </div>
            </div>

            <!-- 사용법 -->
            <div>
              <p class="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">이렇게 사용하세요</p>
              <ol class="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <li class="flex items-center gap-2">
                  <span class="text-base">🔍</span> 상단 탭에서 투자하고 싶은 지수를 선택
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-base">📊</span> 카드에서 비용이 가장 낮은 ETF 확인
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-base">📋</span> 자세히 비교하기로 운용사별 전체 비교
                </li>
              </ol>
            </div>

          </div>

          <!-- 푸터 -->
          <div class="border-t px-6 py-3 dark:border-gray-700">
            <p class="text-center text-xs text-gray-400 dark:text-gray-600">
              데이터 출처: 네이버 금융 · 실부담비용은 직전 회계연도 기준입니다
            </p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

useHead(computed(() => ({
  bodyAttrs: { class: props.modelValue ? 'overflow-hidden' : '' }
})))
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
