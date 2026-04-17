<script setup lang="ts">
import type { z } from 'zod'

const props = defineProps<{
  schema: z.ZodTypeAny
  loading: boolean
}>()

const requestState = defineModel<{ email: string }>({ required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <UForm
    :schema="props.schema"
    :state="requestState"
    class="space-y-4"
    @submit.prevent="emit('submit')"
  >
    <UFormField name="email" label="Email">
      <UInput v-model="requestState.email" type="email" class="w-full" />
    </UFormField>

    <UButton type="submit" class="w-full justify-center" :loading="props.loading">
      Send reset link
    </UButton>
  </UForm>
</template>
