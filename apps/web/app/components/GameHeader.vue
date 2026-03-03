<script setup lang="ts">
const emit = defineEmits<{
  help: []
  stats: []
  settings: []
}>()

const settings = useSettings()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-b border-default pt-[calc(0.75rem+env(safe-area-inset-top))] select-none">
    <!-- Left: Help -->
    <div class="flex items-center gap-1">
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        icon="i-lucide-help-circle"
        aria-label="How to play"
        @click="emit('help')"
      />
    </div>

    <!-- Center: Title -->
    <div class="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-default">
      <img src="/favicon.svg" alt="" class="w-8 h-8 drop-shadow-sm" aria-hidden="true">
      <h1 class="text-3xl font-bold font-display tracking-tight text-primary">
        Clawdle
      </h1>
    </div>

    <!-- Right: Stats & Settings -->
    <div class="flex items-center gap-1">
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        icon="i-lucide-bar-chart-2"
        aria-label="Statistics"
        @click="emit('stats')"
      />
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        :icon="settings.darkMode.preference === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
        aria-label="Toggle dark mode"
        @click="settings.toggleDarkMode()"
      />
    </div>
  </div>
</template>
