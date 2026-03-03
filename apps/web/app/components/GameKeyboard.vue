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
  if (state === 'correct') return 'bg-primary text-white border-primary hover:bg-primary/80'
  if (state === 'present') return 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
  if (state === 'absent') return 'bg-muted text-muted border-muted hover:bg-muted/80'
  return 'bg-elevated text-default border-default hover:bg-muted'
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
      <button
        v-for="key in row"
        :key="key"
        :class="[
          'keyboard-key h-14 sm:h-14 rounded-md font-bold text-xs sm:text-sm px-1 border',
          getKeyColor(key),
          getKeyWidth(key),
        ]"
        type="button"
        @click="handleKey(key)"
      >
        {{ getKeyLabel(key) }}
      </button>
    </div>
  </div>
</template>
