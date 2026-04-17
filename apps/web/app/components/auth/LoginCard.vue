<script setup lang="ts">
import { z } from 'zod'
import { toUserFacingAuthError } from '~/utils/auth-errors'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    redirectPath?: string
  }>(),
  {
    title: 'Welcome back',
    subtitle: 'Sign in with Apple first, or use email if you prefer.',
    redirectPath: undefined,
  },
)

const emit = defineEmits<{
  success: [user: { id: string; name: string | null; email: string }]
}>()

const config = useRuntimeConfig()
const route = useRoute()
const { login, startOAuth } = useAuth()

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const state = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const appleLoading = ref(false)
const errorMsg = ref('')
const { infoMsg } = useAuthLoginRouteHint(state, route)

const canUseApple = computed(
  () => config.public.authBackend === 'supabase' && config.public.authProviders.includes('apple'),
)
const canRegister = computed(() => config.public.authPublicSignup)
const resolvedRedirectPath = computed(() => props.redirectPath || config.public.authRedirectPath)

async function onSubmit() {
  const parsed = schema.safeParse(state)
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues.map((issue) => issue.message).join(' ')
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const result = await login({
      email: state.email,
      password: state.password,
    })

    if (result.user) {
      emit('success', result.user)
      await navigateTo(result.redirectTo || resolvedRedirectPath.value, { replace: true })
      return
    }

    errorMsg.value = result.message || 'Sign-in did not complete.'
  } catch (error) {
    errorMsg.value = toUserFacingAuthError(error, 'Invalid email or password.')
  } finally {
    loading.value = false
  }
}

async function onAppleSignIn() {
  appleLoading.value = true
  errorMsg.value = ''

  try {
    const result = await startOAuth({
      provider: 'apple',
      next: resolvedRedirectPath.value,
    })
    await navigateTo(result.url, { external: true })
  } catch (error) {
    errorMsg.value = toUserFacingAuthError(error, 'Unable to start Sign in with Apple.')
  } finally {
    appleLoading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-bold">
          {{ title }}
        </h1>
        <p class="text-sm text-muted">
          {{ subtitle }}
        </p>
      </div>
    </template>

    <UAlert
      v-if="infoMsg"
      color="success"
      variant="subtle"
      title="Check your inbox"
      :description="infoMsg"
      class="mb-4"
    />

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="subtle"
      title="Sign-in failed"
      :description="errorMsg"
      class="mb-4"
      data-testid="auth-login-error"
    />

    <div class="space-y-4">
      <AuthSharedAppleEmailGate
        :can-use-apple="canUseApple"
        :apple-loading="appleLoading"
        divider-label="Or continue with email"
        @apple-click="onAppleSignIn"
      />

      <AuthLoginEmailCredentialsForm
        :schema="schema"
        v-model="state"
        :loading="loading"
        :reset-path="config.public.authResetPath"
        @submit="onSubmit"
      />
    </div>

    <template #footer>
      <p class="text-center text-sm text-muted">
        <template v-if="canRegister">
          Don&apos;t have an account?
          <ULink
            :to="config.public.authRegisterPath"
            class="font-medium text-primary hover:underline"
          >
            Sign up
          </ULink>
        </template>
        <template v-else> Need access? Contact an administrator for an invite. </template>
      </p>
    </template>
  </UCard>
</template>
