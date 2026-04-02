export function usePlayerStats() {
  return useFetch('/api/stats', {
    immediate: false,
    key: 'player-stats',
  })
}
