<script setup lang="ts">
import type { z } from 'zod'

const props = defineProps<{
  schema: z.ZodTypeAny
  loading: boolean
}>()

const state = defineModel<{ name: string; email: string; password: string }>({ required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <UForm :schema="props.schema" :state="state" class="space-y-4" @submit.prevent="emit('submit')">
    <UFormField name="name" label="Name">
      <UInput
        v-model="state.name"
        placeholder="Jane Doe"
        class="w-full"
        data-testid="auth-register-name"
      />
    </UFormField>

    <UFormField name="email" label="Email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
        class="w-full"
        data-testid="auth-register-email"
      />
    </UFormField>

    <UFormField name="password" label="Password">
      <UInput
        v-model="state.password"
        type="password"
        placeholder="Create a strong password"
        class="w-full"
        data-testid="auth-register-password"
      />
    </UFormField>

    <UButton
      type="submit"
      color="primary"
      class="w-full justify-center"
      :loading="props.loading"
      data-testid="auth-register-submit"
    >
      Create Account
    </UButton>
  </UForm>
</template>
