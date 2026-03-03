<script setup lang="ts">
const props = defineProps<{
  letter: string
  state: 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  delay?: number
  animate?: boolean
  bounce?: boolean
}>()

const tileClass = computed(() => {
  const base = 'game-tile w-14 h-14 sm:w-16 sm:h-16 text-3xl sm:text-4xl rounded-2xl font-display font-bold select-none flex items-center justify-center leading-none transition-all duration-200'
  const states: Record<string, string> = {
    empty: 'border-[3px] border-slate-200 dark:border-slate-800 bg-transparent',
    tbd: 'border-[3px] border-b-[6px] border-indigo-400 dark:border-indigo-500 bg-white dark:bg-slate-800 text-indigo-950 dark:text-indigo-50 shadow-sm transform -translate-y-0.5',
    correct: 'border-[3px] border-b-[6px] border-emerald-600 bg-emerald-500 text-white shadow-md',
    present: 'border-[3px] border-b-[6px] border-orange-600 bg-orange-500 text-white shadow-md',
    absent: 'border-[3px] border-b-[3px] border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 opacity-80',
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
