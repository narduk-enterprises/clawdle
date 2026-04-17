import { z } from 'zod'
import { toUserFacingAuthError } from '~/utils/auth-errors'

export function useResetPasswordFlow() {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { user, changePassword, requestPasswordReset } = useAuth()

  const requestSchema = z.object({
    email: z.string().email('Enter a valid email address.'),
  })

  const updateSchema = z
    .object({
      currentPassword: z.string().optional(),
      newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
      confirmPassword: z.string().min(8, 'Confirm your new password.'),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    })

  const requestState = reactive({
    email: typeof route.query.email === 'string' ? route.query.email : '',
  })

  const updateState = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const loading = ref(false)
  const successMsg = ref('')
  const errorMsg = ref('')

  const isRecoveryMode = computed(() => route.query.recovery === '1')
  const needsCurrentPassword = computed(
    () => !user.value?.needsPasswordSetup && !isRecoveryMode.value,
  )
  const resolvedNextPath = computed(() =>
    typeof route.query.next === 'string' ? route.query.next : config.public.authRedirectPath,
  )

  async function onRequestReset() {
    const parsed = requestSchema.safeParse(requestState)
    if (!parsed.success) {
      errorMsg.value = parsed.error.issues.map((issue) => issue.message).join(' ')
      return
    }

    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''

    try {
      const result = await requestPasswordReset({ email: requestState.email })
      successMsg.value = result.message || 'Check your email for the reset link.'
    } catch (error) {
      errorMsg.value = toUserFacingAuthError(error, 'Unable to send the reset email.')
    } finally {
      loading.value = false
    }
  }

  async function onUpdatePassword() {
    const parsed = updateSchema.safeParse(updateState)
    if (!parsed.success) {
      errorMsg.value = parsed.error.issues.map((issue) => issue.message).join(' ')
      return
    }

    if (needsCurrentPassword.value && !updateState.currentPassword) {
      errorMsg.value = 'Current password is required before setting a new one.'
      return
    }

    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''

    try {
      await changePassword({
        currentPassword: updateState.currentPassword || undefined,
        newPassword: updateState.newPassword,
      })
      await navigateTo(
        {
          path: config.public.authLoginPath,
          query: { reset: '1' },
        },
        { replace: true },
      )
    } catch (error) {
      errorMsg.value = toUserFacingAuthError(error, 'Unable to update the password.')
    } finally {
      loading.value = false
    }
  }

  return {
    config,
    requestSchema,
    updateSchema,
    requestState,
    updateState,
    loading,
    successMsg,
    errorMsg,
    isRecoveryMode,
    needsCurrentPassword,
    resolvedNextPath,
    onRequestReset,
    onUpdatePassword,
  }
}
