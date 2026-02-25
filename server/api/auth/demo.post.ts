/**
 * POST /api/auth/demo
 *
 * One-click demo login. Creates or finds the demo user and returns
 * an authenticated session. Used by the "Try Demo Account" button.
 */
export default defineEventHandler(async (event) => {
  const DEMO_EMAIL = 'demo@example.com'
  const DEMO_PASSWORD = 'demo1234'
  const DEMO_NAME = 'Demo User'

  // Find or create the demo user
  let user = await getUserByEmail(DEMO_EMAIL)

  if (!user) {
    user = await createUser(DEMO_EMAIL, DEMO_PASSWORD, DEMO_NAME)
  }

  const sessionId = await createSession(user.id)

  setCookie(event, 'session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }
})
