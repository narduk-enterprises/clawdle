<script setup lang="ts">
const emit = defineEmits<{
  help: []
  stats: []
  settings: []
}>()

const settings = useSettings()
</script>

<template>
  <header class="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
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
    <div class="flex items-center gap-2">
      <span class="text-xl" aria-hidden="true">🐾</span>
      <h1 class="text-2xl font-bold font-display tracking-tight">
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
  </header>
</template>
