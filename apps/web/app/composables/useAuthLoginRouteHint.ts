import type { RouteLocationNormalizedLoaded } from 'vue-router'

export function useAuthLoginRouteHint(
  state: { email: string },
  route: RouteLocationNormalizedLoaded,
) {
  const infoMsg = ref('')

  watchEffect(() => {
    if (typeof route.query.email === 'string' && !state.email) {
      state.email = route.query.email
    }

    if (route.query.checkEmail === '1') {
      infoMsg.value = `Check ${state.email || 'your email'} to confirm the account.`
      return
    }

    if (route.query.reset === '1') {
      infoMsg.value = 'Your password was updated. Sign in with the new password.'
      return
    }

    infoMsg.value = ''
  })

  return { infoMsg }
}
