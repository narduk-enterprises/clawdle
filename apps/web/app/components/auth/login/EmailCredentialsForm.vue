<script setup lang="ts">
import type { z } from 'zod'

const props = defineProps<{
  schema: z.ZodTypeAny
  loading: boolean
  resetPath: string
}>()

const state = defineModel<{ email: string; password: string }>({ required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <UForm :schema="props.schema" :state="state" class="space-y-4" @submit.prevent="emit('submit')">
    <UFormField name="email" label="Email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
        class="w-full"
        data-testid="auth-login-email"
      />
    </UFormField>

    <UFormField name="password" label="Password">
      <UInput
        v-model="state.password"
        type="password"
        placeholder="••••••••"
        class="w-full"
        data-testid="auth-login-password"
      />
    </UFormField>

    <div class="flex justify-end">
      <ULink :to="props.resetPath" class="text-xs text-muted hover:text-primary">
        Forgot your password?
      </ULink>
    </div>

    <UButton
      type="submit"
      color="primary"
      class="w-full justify-center"
      :loading="props.loading"
      data-testid="auth-login-submit"
    >
      Sign In
    </UButton>
  </UForm>
</template>
