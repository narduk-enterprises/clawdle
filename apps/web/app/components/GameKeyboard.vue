<script setup lang="ts">
const emit = defineEmits<{
  key: [letter: string]
  enter: []
  backspace: []
}>()

const { keyStates } = useGame()
const haptics = useHaptics()

const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
]

function getKeyColor(key: string): string {
  const state = keyStates.value[key]
  if (state === 'correct') return 'bg-green-600 text-white hover:bg-green-500'
  if (state === 'present') return 'bg-yellow-500 text-white hover:bg-yellow-400'
  if (state === 'absent') return 'bg-gray-500 dark:bg-gray-600 text-white opacity-80'
  return 'bg-gray-200 dark:bg-gray-500 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-400'
}

function handleKey(key: string) {
  haptics.lightTap()
  if (key === 'enter') emit('enter')
  else if (key === 'backspace') emit('backspace')
  else emit('key', key)
}

function getKeyLabel(key: string): string {
  if (key === 'backspace') return '⌫'
  if (key === 'enter') return 'ENTER'
  return key.toUpperCase()
}

function getKeyWidth(key: string): string {
  if (key === 'enter' || key === 'backspace') return 'flex-[1.5] max-w-[5rem]'
  return 'flex-1 max-w-[3rem]'
}
</script>

<template>
  <div class="flex flex-col items-center gap-1.5 w-full px-1">
    <div
      v-for="(row, rowIdx) in rows"
      :key="rowIdx"
      class="flex gap-1 sm:gap-1.5 justify-center w-full"
    >
      <!-- eslint-disable-next-line atx/no-native-button -->
      <button
        v-for="key in row"
        :key="key"
        :class="[
          'keyboard-key h-14 sm:h-[3.75rem] font-display font-bold text-sm sm:text-base rounded-xl transition-all duration-100 uppercase flex items-center justify-center',
          getKeyColor(key),
          getKeyWidth(key),
        ]"
        @click="handleKey(key)"
      >
        {{ getKeyLabel(key) }}
      </button>
    </div>
  </div>
</template>
