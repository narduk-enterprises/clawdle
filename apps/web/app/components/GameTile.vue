<script setup lang="ts">
const props = defineProps<{
  letter: string
  state: 'empty' | 'tbd' | 'correct' | 'present' | 'absent'
  delay?: number
  animate?: boolean
  bounce?: boolean
}>()

const tileClass = computed(() => {
  const base = 'game-tile w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl rounded-lg border-2 font-bold select-none flex items-center justify-center leading-none'
  const states: Record<string, string> = {
    empty: 'border-default bg-transparent',
    tbd: 'border-muted bg-transparent text-default tile-filled',
    correct: 'border-primary bg-primary text-white',
    present: 'border-amber-500 bg-amber-500 text-white',
    absent: 'border-muted bg-muted text-white',
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
