import { useRefreshedSessionUser } from '@narduk-enterprises/narduk-nuxt-template-layer-auth/server/utils/session-user'

export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/admin/') && path !== '/api/auth/me') {
    return
  }

  await useRefreshedSessionUser(event)
})
