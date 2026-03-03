<script setup lang="ts">
const emit = defineEmits<{
  key: [letter: string]
  enter: []
  backspace: []
}>()

const { keyStates } = useGame()

const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
]

function getKeyColor(key: string): string {
  const state = keyStates.value[key]
  if (state === 'correct') return 'bg-emerald-500 text-white border-[3px] border-b-[6px] border-emerald-600 hover:bg-emerald-400 active:translate-y-[3px] active:border-b-[3px]'
  if (state === 'present') return 'bg-orange-500 text-white border-[3px] border-b-[6px] border-orange-600 hover:bg-orange-400 active:translate-y-[3px] active:border-b-[3px]'
  if (state === 'absent') return 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-[3px] border-slate-300 dark:border-slate-700 opacity-80'
  return 'bg-white dark:bg-slate-800 text-indigo-950 dark:text-indigo-100 border-[3px] border-b-[6px] border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-slate-700 active:translate-y-[3px] active:border-b-[3px]'
}

function handleKey(key: string) {
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
  if (key === 'enter' || key === 'backspace') return 'min-w-[4rem] sm:min-w-[5rem]'
  return 'min-w-[2rem] sm:min-w-[2.75rem]'
}
</script>

<template>
  <div class="flex flex-col items-center gap-1.5">
    <div
      v-for="(row, rowIdx) in rows"
      :key="rowIdx"
      class="flex gap-1 sm:gap-1.5 justify-center"
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
