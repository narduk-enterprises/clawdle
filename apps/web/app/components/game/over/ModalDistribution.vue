<script setup lang="ts">
const props = defineProps<{
  distribution: Record<string, number>
  attempts: number
  status: 'idle' | 'in_progress' | 'won' | 'lost'
}>()

const maxDistribution = computed(() => Math.max(...Object.values(props.distribution), 1))

function getBarWidth(count: number): string {
  return `${Math.max((count / maxDistribution.value) * 100, 7)}%`
}

function getDistCount(i: number): number {
  return props.distribution[String(i)] ?? 0
}

function isHighlightedRow(i: number): boolean {
  return props.status === 'won' && props.attempts === i
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
</script>

<template>
  <div>
    <h3 class="text-xs font-semibold mb-2 text-dimmed uppercase tracking-wider">
      Guess Distribution
    </h3>
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
</template>
