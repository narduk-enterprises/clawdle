<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { data: stats, refresh } = await usePlayerStats()

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) await refresh()
  },
)

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

function getDistributionBarClass(i: number) {
  return getDistCount(i) > 0 ? 'bg-primary' : 'bg-muted'
}

function getDistributionBarStyle(i: number) {
  return { width: getBarWidth(getDistCount(i)) }
}

function handleUpdateOpen(val: boolean) {
  emit('update:open', val)
}
</script>

<template>
  <UModal :open="props.open" @update:open="handleUpdateOpen">
    <template #header>
      <h2 class="text-xl font-bold font-display">Statistics</h2>
    </template>

    <template #body>
      <div v-if="stats" class="space-y-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-4 gap-2 text-center">
          <div>
            <div class="text-3xl font-bold font-display">
              {{ stats.gamesPlayed }}
            </div>
            <div class="text-xs text-dimmed">Played</div>
          </div>
          <div>
            <div class="text-3xl font-bold font-display">
              {{ stats.winPercentage }}
            </div>
            <div class="text-xs text-dimmed">Win %</div>
          </div>
          <div>
            <div class="text-3xl font-bold font-display">
              {{ stats.currentStreak }}
            </div>
            <div class="text-xs text-dimmed">Current Streak</div>
          </div>
          <div>
            <div class="text-3xl font-bold font-display">
              {{ stats.maxStreak }}
            </div>
            <div class="text-xs text-dimmed">Max Streak</div>
          </div>
        </div>

        <USeparator />

        <!-- Guess Distribution -->
        <div>
          <h3 class="text-sm font-semibold mb-3 text-muted">Guess Distribution</h3>
          <div class="space-y-1">
            <div v-for="i in 6" :key="i" class="flex items-center gap-2">
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
      </div>

      <div v-else class="text-center py-8 text-dimmed">Loading stats...</div>
    </template>
  </UModal>
</template>
