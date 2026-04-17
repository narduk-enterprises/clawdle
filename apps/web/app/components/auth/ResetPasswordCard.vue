<script setup lang="ts">
const {
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
} = useResetPasswordFlow()
</script>

<template>
  <div
    class="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center justify-center px-4 py-12"
  >
    <UCard class="w-full">
      <template #header>
        <div class="space-y-2 text-center">
          <h1 class="text-2xl font-bold">
            {{ isRecoveryMode ? 'Choose a new password' : 'Reset your password' }}
          </h1>
          <p class="text-sm text-muted">
            {{
              isRecoveryMode
                ? 'Finish recovery on this app without leaving your current domain.'
                : 'We will send a password reset link to your email address.'
            }}
          </p>
        </div>
      </template>

      <UAlert
        v-if="successMsg"
        color="success"
        variant="subtle"
        title="Email sent"
        :description="successMsg"
        class="mb-4"
      />

      <UAlert
        v-if="errorMsg"
        color="error"
        variant="subtle"
        title="Request failed"
        :description="errorMsg"
        class="mb-4"
      />

      <AuthResetRequestPanel
        v-if="!isRecoveryMode"
        :schema="requestSchema"
        v-model="requestState"
        :loading="loading"
        @submit="onRequestReset"
      />

      <AuthResetUpdatePanel
        v-else
        :schema="updateSchema"
        v-model="updateState"
        :needs-current-password="needsCurrentPassword"
        :loading="loading"
        @submit="onUpdatePassword"
      />

      <template #footer>
        <div class="flex justify-center">
          <UButton
            :to="isRecoveryMode ? resolvedNextPath : config.public.authLoginPath"
            color="neutral"
            variant="ghost"
          >
            {{ isRecoveryMode ? 'Back to app' : 'Back to sign in' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
