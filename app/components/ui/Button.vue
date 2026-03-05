<template>
  <button
    class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
