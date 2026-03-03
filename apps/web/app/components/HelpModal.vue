<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

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
      <h2 class="text-xl font-bold font-display">
        How To Play
      </h2>
    </template>

    <template #body>
      <div class="space-y-4 text-sm text-dimmed">
        <p>Guess the <strong class="text-default">Clawdle</strong> in 6 tries.</p>

        <ul class="list-disc pl-5 space-y-2">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of the tiles will change to show how close your guess was to the word.</li>
        </ul>

        <div class="space-y-3 pt-2">
          <div>
            <p class="font-semibold mb-2 text-default">Examples</p>
            <div class="flex gap-1.5">
              <div class="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2 border-primary bg-primary text-white">
                W
              </div>
              <div
                v-for="letter in ['E', 'A', 'R', 'Y']"
                :key="letter"
                class="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2 border-default text-default"
              >
                {{ letter }}
              </div>
            </div>
            <p class="mt-1 text-xs">
              <strong class="text-default">W</strong> is in the word and in the correct spot.
            </p>
          </div>

          <div>
            <div class="flex gap-1.5">
              <div class="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2 border-default text-default">
                P
              </div>
              <div class="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2" style="background-color: var(--color-amber-500); border-color: var(--color-amber-500); color: white;">
                I
              </div>
              <div
                v-for="letter in ['L', 'L', 'S']"
                :key="letter"
                class="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2 border-default text-default"
              >
                {{ letter }}
              </div>
            </div>
            <p class="mt-1 text-xs">
              <strong class="text-default">I</strong> is in the word but in the wrong spot.
            </p>
          </div>

          <div>
            <div class="flex gap-1.5">
              <div
                v-for="(letter, idx) in ['V', 'A', 'G', 'U', 'E']"
                :key="letter"
                :class="[
                  'w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2',
                  idx === 3 ? 'border-muted bg-muted text-white' : 'border-default text-default',
                ]"
              >
                {{ letter }}
              </div>
            </div>
            <p class="mt-1 text-xs">
              <strong class="text-default">U</strong> is not in the word in any spot.
            </p>
          </div>
        </div>

        <USeparator />

        <p class="text-xs">
          A new Clawdle is available each day!
        </p>
      </div>
    </template>
  </UModal>
</template>
