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
    title: 'Create an account',
    subtitle: 'Start with Apple, then fall back to email when needed.',
    redirectPath: undefined,
  },
)

const emit = defineEmits<{
  success: [user: { id: string; name: string | null; email: string }]
}>()

const config = useRuntimeConfig()
const { register, startOAuth } = useAuth()

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const state = reactive({
  name: '',
  email: '',
  password: '',
})

const loading = ref(false)
const appleLoading = ref(false)
const errorMsg = ref('')

const canUseApple = computed(
  () => config.public.authBackend === 'supabase' && config.public.authProviders.includes('apple'),
)
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
    const result = await register({
      name: state.name,
      email: state.email,
      password: state.password,
      next: resolvedRedirectPath.value,
    })

    if (result.user) {
      emit('success', result.user)
      await navigateTo(result.redirectTo || resolvedRedirectPath.value, { replace: true })
      return
    }

    if (result.nextStep === 'email_confirmation') {
      await navigateTo(
        {
          path: config.public.authLoginPath,
          query: {
            checkEmail: '1',
            email: state.email,
          },
        },
        { replace: true },
      )
      return
    }

    errorMsg.value = result.message || 'Signup did not complete.'
  } catch (error) {
    errorMsg.value = toUserFacingAuthError(error, 'Unable to create the account.')
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
      v-if="errorMsg"
      color="error"
      variant="subtle"
      title="Signup failed"
      :description="errorMsg"
      class="mb-4"
      data-testid="auth-register-error"
    />

    <div class="space-y-4">
      <AuthSharedAppleEmailGate
        :can-use-apple="canUseApple"
        :apple-loading="appleLoading"
        divider-label="Or sign up with email"
        @apple-click="onAppleSignIn"
      />

      <AuthRegisterEmailSignupForm
        :schema="schema"
        v-model="state"
        :loading="loading"
        @submit="onSubmit"
      />
    </div>

    <template #footer>
      <p class="text-center text-sm text-muted">
        Already have an account?
        <ULink :to="config.public.authLoginPath" class="font-medium text-primary hover:underline">
          Sign in
        </ULink>
      </p>
    </template>
  </UCard>
</template>
