<script setup lang="ts">
const props = defineProps<{
  letter: string
  state: 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  delay?: number
  animate?: boolean
  bounce?: boolean
}>()

const tileClass = computed(() => {
  const base = 'game-tile flex-1 aspect-square max-w-[4rem] sm:max-w-[4.5rem] text-3xl sm:text-4xl rounded-2xl font-display font-bold select-none flex items-center justify-center leading-none transition-all duration-200'
  const states: Record<string, string> = {
    empty: 'border-[3px] border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-black/20',
    tbd: 'border-[3px] border-b-[6px] border-indigo-400 dark:border-indigo-500 bg-white dark:bg-slate-800 text-indigo-950 dark:text-indigo-50 shadow-sm transform -translate-y-0.5',
    correct: 'border-[3px] border-b-[6px] border-emerald-600 bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    present: 'border-[3px] border-b-[6px] border-orange-600 bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    absent: 'border-[3px] border-b-[3px] border-slate-400 dark:border-slate-700 bg-slate-200 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 opacity-90',
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
