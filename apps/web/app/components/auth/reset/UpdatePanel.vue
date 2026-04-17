<script setup lang="ts">
import type { z } from 'zod'

const props = defineProps<{
  schema: z.ZodTypeAny
  loading: boolean
  needsCurrentPassword: boolean
}>()

const updateState = defineModel<{
  currentPassword: string
  newPassword: string
  confirmPassword: string
}>({ required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <UForm
    :schema="props.schema"
    :state="updateState"
    class="space-y-4"
    @submit.prevent="emit('submit')"
  >
    <UFormField v-if="props.needsCurrentPassword" name="currentPassword" label="Current password">
      <UInput v-model="updateState.currentPassword" type="password" class="w-full" />
    </UFormField>

    <UFormField name="newPassword" label="New password">
      <UInput v-model="updateState.newPassword" type="password" class="w-full" />
    </UFormField>

    <UFormField name="confirmPassword" label="Confirm new password">
      <UInput v-model="updateState.confirmPassword" type="password" class="w-full" />
    </UFormField>

    <UButton type="submit" class="w-full justify-center" :loading="props.loading">
      Save new password
    </UButton>
  </UForm>
</template>
