<script setup lang="ts">
defineProps<{
  gamesPlayed: number
  winPercentage: number
  currentStreak: number
  maxStreak: number
}>()
</script>

<template>
  <div class="grid grid-cols-4 gap-2 text-center">
    <div>
      <div class="text-2xl font-bold font-display">
        {{ gamesPlayed }}
      </div>
      <div class="text-[10px] text-dimmed">Played</div>
    </div>
    <div>
      <div class="text-2xl font-bold font-display">
        {{ winPercentage }}
      </div>
      <div class="text-[10px] text-dimmed">Win %</div>
    </div>
    <div>
      <div class="text-2xl font-bold font-display">
        {{ currentStreak }}
      </div>
      <div class="text-[10px] text-dimmed">Current</div>
    </div>
    <div>
      <div class="text-2xl font-bold font-display">
        {{ maxStreak }}
      </div>
      <div class="text-[10px] text-dimmed">Max</div>
    </div>
  </div>
</template>
