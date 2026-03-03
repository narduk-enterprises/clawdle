<script setup lang="ts">
const { board, currentRow, gameState, isRevealing, shakeRow, bounceRow } = useGame()

function getTileState(row: number, col: number): 'empty' | 'tbd' | 'correct' | 'present' | 'absent' {
  // Already submitted rows — use feedback
  if (row < gameState.value.guesses.length) {
    return gameState.value.guesses[row]!.feedback[col]!
  }
  // Current row with letters typed
  if (board.value[row]?.[col]) {
    return 'tbd'
  }
  return 'empty'
}

function shouldAnimate(row: number): boolean {
  // Animate the row that was just submitted (during reveal)
  if (!isRevealing.value) return false
  return row === currentRow.value
}

function shouldBounce(row: number): boolean {
  return bounceRow.value === row
}
</script>

<template>
  <div class="flex flex-col items-center gap-1.5">
    <!-- eslint-disable vue-official/no-template-complex-expressions -->
    <div
      v-for="(row, rowIdx) in board"
      :key="rowIdx"
      :class="[
        'flex gap-1.5',
        shakeRow === rowIdx ? 'animate-shake' : '',
      ]"
    >
      <GameTile
        v-for="(letter, colIdx) in row"
        :key="colIdx"
        :letter="letter"
        :state="getTileState(rowIdx, colIdx)"
        :delay="colIdx * 300"
        :animate="shouldAnimate(rowIdx)"
        :bounce="shouldBounce(rowIdx)"
      />
    </div>
  </div>
</template>
