<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { gameState, nextPuzzleTime, getShareText } = useGame()
const toast = useToast()

const modalTitle = computed(() => gameState.value.status === 'won' ? '🎉 You got it!' : '😿 Better luck next time')

const { data: stats, refresh } = await usePlayerStats()

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await refresh()
  }
})

// Countdown timer
const countdown = ref('')
let countdownInterval: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  const ms = nextPuzzleTime.value
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
  } else if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

const maxDistribution = computed(() => {
  if (!stats.value) return 1
  const dist = stats.value.guessDistribution as Record<string, number>
  return Math.max(...Object.values(dist), 1)
})

function getBarWidth(count: number): string {
  return `${Math.max((count / maxDistribution.value) * 100, 7)}%`
}

function getDistCount(i: number): number {
  if (!stats.value || !('guessDistribution' in stats.value)) return 0
  return (stats.value.guessDistribution as Record<string, number>)[String(i)] ?? 0
}

function isHighlightedRow(i: number): boolean {
  return gameState.value.status === 'won' && gameState.value.attempts === i
}

function getDistributionBarClass(i: number) {
  return [
    getDistCount(i) > 0 ? 'bg-indigo-500 dark:bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700',
    isHighlightedRow(i) ? '!bg-emerald-500 !dark:bg-emerald-500' : '',
  ]
}

function getDistributionBarStyle(i: number) {
  return { width: getBarWidth(getDistCount(i)) }
}

async function shareResult() {
  const text = getShareText()
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'Copied to clipboard!', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to copy', color: 'error' })
  }
}

function handleUpdateOpen(val: boolean) {
  emit('update:open', val)
}
</script>

<template>
  <UModal
    :open="props.open"
    @update:open="handleUpdateOpen"
  >
    <template #header>
      <h2 class="text-xl font-bold font-display text-center w-full">
        {{ modalTitle }}
      </h2>
    </template>

    <template #body>
      <div class="space-y-5">
        <!-- Result -->
        <div v-if="gameState.status === 'lost'" class="text-center">
          <p class="text-sm text-dimmed">
            The word was
          </p>
          <p class="text-2xl font-bold font-display uppercase tracking-widest text-primary">
            {{ gameState.answer }}
          </p>
        </div>

        <div v-if="gameState.status === 'won'" class="text-center">
          <p class="text-sm text-dimmed">
            Solved in
          </p>
          <p class="text-3xl font-bold font-display text-primary">
            {{ gameState.attempts }}/6
          </p>
        </div>

        <!-- Stats Summary -->
        <div v-if="stats" class="grid grid-cols-4 gap-2 text-center">
          <div>
            <div class="text-2xl font-bold font-display">
              {{ stats.gamesPlayed }}
            </div>
            <div class="text-[10px] text-dimmed">
              Played
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold font-display">
              {{ stats.winPercentage }}
            </div>
            <div class="text-[10px] text-dimmed">
              Win %
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold font-display">
              {{ stats.currentStreak }}
            </div>
            <div class="text-[10px] text-dimmed">
              Current
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold font-display">
              {{ stats.maxStreak }}
            </div>
            <div class="text-[10px] text-dimmed">
              Max
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Guess Distribution -->
        <div v-if="stats">
          <h3 class="text-xs font-semibold mb-2 text-dimmed uppercase tracking-wider">
            Guess Distribution
          </h3>
          <div class="space-y-1">
            <div
              v-for="i in 6"
              :key="i"
              class="flex items-center gap-2"
            >
              <span class="w-3 text-xs font-bold text-dimmed">{{ i }}</span>
              <div
                class="distribution-bar h-5 rounded-sm flex items-center justify-end px-1.5 text-xs font-bold text-white"
                :class="getDistributionBarClass(i)"
                :style="getDistributionBarStyle(i)"
              >
                {{ getDistCount(i) }}
              </div>
            </div>
          </div>
        </div>

        <USeparator />

        <!-- Next Puzzle Countdown -->
        <div class="text-center">
          <p class="text-xs text-dimmed uppercase tracking-wider mb-1">
            Next Clawdle
          </p>
          <p class="text-2xl font-bold font-display tabular-nums">
            {{ countdown }}
          </p>
        </div>

        <!-- Share Button -->
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
      </div>
    </template>
  </UModal>
</template>
