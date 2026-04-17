<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { gameState, getNextPuzzleTime, getShareText, startNewGame } = useGame()
const toast = useToast()

const modalTitle = computed(() =>
  gameState.value.status === 'won' ? '🎉 You got it!' : '😿 Better luck next time',
)

const { data: stats, refresh } = await usePlayerStats()

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await refresh()
    }
  },
)

const countdown = ref('')
let countdownInterval: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  const ms = getNextPuzzleTime()
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      updateCountdown()
      countdownInterval = setInterval(updateCountdown, 1000)
    } else if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  },
)

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

async function shareResult() {
  const text = getShareText()
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'Copied to clipboard!', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to copy', color: 'error' })
  }
}

async function startNewGameClicked() {
  await startNewGame()
  emit('update:open', false)
}

function handleUpdateOpen(val: boolean) {
  emit('update:open', val)
}

const guessDistribution = computed(() => {
  if (!stats.value || !('guessDistribution' in stats.value)) return {}
  return stats.value.guessDistribution as Record<string, number>
})
</script>

<template>
  <UModal :open="props.open" @update:open="handleUpdateOpen">
    <template #header>
      <h2 class="text-xl font-bold font-display text-center w-full">
        {{ modalTitle }}
      </h2>
    </template>

    <template #body>
      <div class="space-y-5">
        <div v-if="gameState.status === 'lost'" class="text-center">
          <p class="text-sm text-dimmed">The word was</p>
          <p class="text-2xl font-bold font-display uppercase tracking-widest text-primary">
            {{ gameState.answer }}
          </p>
        </div>

        <div v-if="gameState.status === 'won'" class="text-center">
          <p class="text-sm text-dimmed">Solved in</p>
          <p class="text-3xl font-bold font-display text-primary">{{ gameState.attempts }}/6</p>
        </div>

        <GameOverModalSummaryStats
          v-if="stats"
          :games-played="stats.gamesPlayed"
          :win-percentage="stats.winPercentage"
          :current-streak="stats.currentStreak"
          :max-streak="stats.maxStreak"
        />

        <USeparator />

        <GameOverModalDistribution
          v-if="stats"
          :distribution="guessDistribution"
          :attempts="gameState.attempts"
          :status="gameState.status"
        />

        <USeparator />

        <div class="text-center">
          <p class="text-xs text-dimmed uppercase tracking-wider mb-1">Next Clawdle</p>
          <p class="text-2xl font-bold font-display tabular-nums">
            {{ countdown }}
          </p>
        </div>

        <UButton
          block
          size="xl"
          color="primary"
          icon="i-lucide-share-2"
          class="font-display font-bold text-lg rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2 py-3"
          @click="shareResult"
        >
          Share Result
        </UButton>

        <UButton
          block
          size="xl"
          color="neutral"
          variant="outline"
          icon="i-lucide-play"
          class="font-display font-bold text-lg rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2 py-3"
          @click="startNewGameClicked"
        >
          Play Again
        </UButton>
      </div>
    </template>
  </UModal>
</template>
