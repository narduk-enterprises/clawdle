<script setup lang="ts">
defineProps<{
  canUseApple: boolean
  appleLoading: boolean
  dividerLabel: string
}>()

const emit = defineEmits<{
  'apple-click': []
}>()
</script>

<template>
  <div v-if="canUseApple" class="space-y-4">
    <UButton
      color="neutral"
      variant="solid"
      class="w-full justify-center"
      :loading="appleLoading"
      @click="emit('apple-click')"
    >
      Continue with Apple
    </UButton>

    <div class="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-dimmed">
      <span class="h-px flex-1 bg-default" />
      <span>{{ dividerLabel }}</span>
      <span class="h-px flex-1 bg-default" />
    </div>
  </div>
</template>
