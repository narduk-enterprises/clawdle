import { useRefreshedSessionUserResponse } from '@narduk-enterprises/narduk-nuxt-template-layer-auth/server/utils/session-user'

export default defineEventHandler(async (event) => useRefreshedSessionUserResponse(event))
