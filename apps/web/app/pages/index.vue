<script setup lang="ts">
import { useSeo } from '#imports'

useSeo({
  title: 'Clawdle — Daily Word Puzzle',
  description: 'Guess the 5-letter word in 6 tries with color-coded clues. A new puzzle every day!',
  ogImage: { title: 'Clawdle', description: 'Daily Word Puzzle', icon: '🐾' },
})

// eslint-disable-next-line nuxt-guardrails/prefer-use-seo-over-bare-meta
useHead({
  meta: [
    { name: 'description', content: 'Guess the 5-letter word in 6 tries with color-coded clues. A new puzzle every day!' },
    { property: 'og:image', content: '/apple-touch-icon.png' },
  ],
})

useWebPageSchema({
  name: 'Clawdle — Daily Word Puzzle',
  description: 'A daily word puzzle game. Guess the 5-letter word in 6 tries with color-coded clues.',
})

const {
  gameState,
  initGame,
  addLetter,
  removeLetter,
  submitGuess,
} = useGame()

const helpOpen = ref(false)
const statsOpen = ref(false)
const gameOverOpen = ref(false)

// Initialize game on mount
onMounted(async () => {
  await initGame()
})

// Watch for game completion to show the modal
watch(
  () => gameState.value.status,
  (status) => {
    if (status === 'won' || status === 'lost') {
      // Delay so the user can see the final tile animation
      setTimeout(() => {
        gameOverOpen.value = true
      }, 2500)
    }
  },
)

// Physical keyboard input
function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (helpOpen.value || statsOpen.value || gameOverOpen.value) return

  if (e.key === 'Enter') {
    e.preventDefault()
    submitGuess()
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    removeLetter()
  } else if (/^[a-z]$/i.test(e.key)) {
    e.preventDefault()
    addLetter(e.key)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex flex-col h-dvh bg-default transition-colors duration-300">
    <!-- Header -->
    <GameHeader
      @help="helpOpen = true"
      @stats="statsOpen = true"
      @settings="() => {}"
    />

    <!-- Game Area -->
    <div class="flex-1 flex flex-col items-center justify-between py-4 px-2 overflow-hidden">
      <!-- Board -->
      <div class="flex-1 flex items-center">
        <GameBoard />
      </div>

      <!-- Keyboard -->
      <div class="w-full max-w-lg pb-2">
        <GameKeyboard
          @key="addLetter"
          @enter="submitGuess"
          @backspace="removeLetter"
        />
      </div>
    </div>

    <!-- Modals -->
    <HelpModal
      :open="helpOpen"
      @update:open="helpOpen = $event"
    />

    <StatsModal
      :open="statsOpen"
      @update:open="statsOpen = $event"
    />

    <GameOverModal
      :open="gameOverOpen"
      @update:open="gameOverOpen = $event"
    />
  </div>
</template>
