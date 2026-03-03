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
            <div class="flex gap-1.5 transform scale-75 origin-left sm:scale-100 mb-2">
              <GameTile letter="W" state="correct" />
              <GameTile v-for="letter in ['E', 'A', 'R', 'Y']" :key="letter" :letter="letter" state="empty" />
            </div>
            <p class="mt-1 text-xs">
              <strong class="text-default">W</strong> is in the word and in the correct spot.
            </p>
          </div>

          <div>
            <div class="flex gap-1.5 transform scale-75 origin-left sm:scale-100 mb-2">
              <GameTile letter="P" state="tbd" />
              <GameTile letter="I" state="present" />
              <GameTile v-for="letter in ['L', 'L', 'S']" :key="letter" :letter="letter" :state="'tbd'" />
            </div>
            <p class="mt-1 text-xs">
              <strong class="text-default">I</strong> is in the word but in the wrong spot.
            </p>
          </div>

          <div>
            <div class="flex gap-1.5 transform scale-75 origin-left sm:scale-100 mb-2">
              <GameTile v-for="(letter, idx) in ['V', 'A', 'G', 'U', 'E']" :key="letter" :letter="letter" :state="idx === 3 ? 'absent' : 'tbd'" />
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
