<script setup lang="ts">
const props = defineProps<{
  letter: string
  state: 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  delay?: number
  animate?: boolean
  bounce?: boolean
}>()

const tileClass = computed(() => {
  const base = 'game-tile flex-1 aspect-square max-w-[4rem] sm:max-w-[4.5rem] text-3xl sm:text-4xl rounded-lg font-display font-bold select-none flex items-center justify-center leading-none transition-all duration-200 hover:scale-[1.06] hover:-translate-y-0.5'
  const states: Record<string, string> = {
    empty: 'border-2 border-gray-300 dark:border-gray-600',
    tbd: 'border-2 border-gray-500 dark:border-gray-400 text-gray-900 dark:text-white',
    correct: 'border-2 border-green-700 bg-green-600 text-white',
    present: 'border-2 border-yellow-600 bg-yellow-500 text-white',
    absent: 'border-2 border-gray-600 bg-gray-500 dark:bg-gray-600 text-white',
  }
  return `${base} ${states[props.state] || states.empty}`
})

const animationStyle = computed(() => {
  if (props.animate && props.delay !== undefined) {
    return { animationDelay: `${props.delay}ms` }
  }
  if (props.bounce && props.delay !== undefined) {
    return { animationDelay: `${props.delay}ms` }
  }
  return {}
})
</script>

<template>
  <div
    :class="[
      tileClass,
      animate ? 'animate-flip' : '',
      bounce ? 'animate-bounce-tile' : '',
      letter && state === 'tbd' ? 'animate-pop' : '',
    ]"
    :style="animationStyle"
  >
    {{ letter.toUpperCase() }}
  </div>
</template>
