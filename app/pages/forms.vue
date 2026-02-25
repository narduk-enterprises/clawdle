<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

/**
 * Forms Demo Page
 *
 * Showcases the standardized form patterns: AppFormCard sizes,
 * Zod validation, form-section / form-row / form-actions utilities.
 */
useSeo({
  title: 'Forms',
  description: 'Standardized form patterns with Zod validation, AppFormCard wrapper, and responsive layout utilities.',
  ogImage: { title: 'Forms Demo', description: 'Form standards showcase', icon: '📝' },
})
useWebPageSchema({ name: 'Forms', description: 'Form design standards demo' })

// ── Login form (narrow) ────────────────────
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type LoginSchema = z.output<typeof loginSchema>
const loginState = reactive<Partial<LoginSchema>>({ email: undefined, password: undefined })

// ── Feedback form (default) ────────────────
const feedbackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rating: z.string().min(1, 'Please select a rating'),
  comments: z.string().min(10, 'Please write at least 10 characters'),
})
type FeedbackSchema = z.output<typeof feedbackSchema>
const feedbackState = reactive<Partial<FeedbackSchema>>({ name: undefined, rating: undefined, comments: undefined })

// ── Settings form (wide) ───────────────────
const settingsSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Please enter a valid email'),
  bio: z.string().optional(),
  language: z.string().min(1, 'Please select a language'),
  notifications: z.boolean().optional(),
})
type SettingsSchema = z.output<typeof settingsSchema>
const settingsState = reactive<Partial<SettingsSchema>>({
  displayName: undefined,
  email: undefined,
  bio: undefined,
  language: undefined,
  notifications: true,
})

const ratingOptions = [
  { label: '⭐ Poor', value: '1' },
  { label: '⭐⭐ Fair', value: '2' },
  { label: '⭐⭐⭐ Good', value: '3' },
  { label: '⭐⭐⭐⭐ Great', value: '4' },
  { label: '⭐⭐⭐⭐⭐ Excellent', value: '5' },
]

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: '日本語', value: 'ja' },
]

const toast = useToast()

function onSubmit(label: string) {
  return (_event: FormSubmitEvent<any>) => {
    toast.add({
      title: 'Form Submitted',
      description: `${label} form submitted successfully!`,
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  }
}
</script>

<template>
  <div class="space-y-16 pb-20">
    <!-- Page header -->
    <div class="text-center space-y-4">
      <h1 class="font-display text-4xl sm:text-5xl font-bold">Form Standards</h1>
      <p class="text-lg text-muted max-w-2xl mx-auto">
        Standardized form patterns using <code>AppFormCard</code>, Zod validation, and responsive layout utilities.
        Three size presets keep forms looking great at any scale.
      </p>
    </div>

    <!-- SIZE: NARROW — Login-style form -->
    <section class="space-y-4">
      <div class="text-center">
        <UBadge color="primary" variant="subtle" size="lg">size="narrow" · 24rem</UBadge>
        <p class="text-sm text-muted mt-2">Best for login, signup, and simple auth flows</p>
      </div>

      <AppFormCard title="Sign In" description="Enter your credentials to continue." icon="i-lucide-log-in" size="narrow">
        <UForm :schema="loginSchema" :state="loginState" class="form-section" @submit="onSubmit('Login')">
          <UFormField label="Email" name="email">
            <UInput v-model="loginState.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput v-model="loginState.password" type="password" placeholder="••••••••" icon="i-lucide-lock" class="w-full" />
          </UFormField>

          <div class="form-actions form-actions-full">
            <UButton type="submit" icon="i-lucide-arrow-right">
              Sign In
            </UButton>
          </div>
        </UForm>
      </AppFormCard>
    </section>

    <USeparator />

    <!-- SIZE: DEFAULT — Feedback form -->
    <section class="space-y-4">
      <div class="text-center">
        <UBadge color="primary" variant="subtle" size="lg">size="default" · 32rem</UBadge>
        <p class="text-sm text-muted mt-2">Standard single-column forms — feedback, surveys, simple data entry</p>
      </div>

      <AppFormCard title="Leave Feedback" description="Tell us how we're doing." icon="i-lucide-message-circle">
        <UForm :schema="feedbackSchema" :state="feedbackState" class="form-section" @submit="onSubmit('Feedback')">
          <UFormField label="Your Name" name="name">
            <UInput v-model="feedbackState.name" placeholder="Jane Doe" icon="i-lucide-user" class="w-full" />
          </UFormField>

          <UFormField label="Rating" name="rating">
            <USelect v-model="feedbackState.rating" :items="ratingOptions" placeholder="Select a rating..." class="w-full" />
          </UFormField>

          <UFormField label="Comments" name="comments">
            <UTextarea v-model="feedbackState.comments" :rows="4" placeholder="What did you like? What could improve?" class="w-full" />
          </UFormField>

          <div class="form-actions">
            <UButton type="submit" icon="i-lucide-send">
              Submit Feedback
            </UButton>
          </div>
        </UForm>
      </AppFormCard>
    </section>

    <USeparator />

    <!-- SIZE: WIDE — Settings form with multi-column -->
    <section class="space-y-4">
      <div class="text-center">
        <UBadge color="primary" variant="subtle" size="lg">size="wide" · 40rem</UBadge>
        <p class="text-sm text-muted mt-2">Multi-column layouts — settings, contact, detailed entry</p>
      </div>

      <AppFormCard title="Account Settings" description="Manage your profile and preferences." icon="i-lucide-settings" size="wide">
        <UForm :schema="settingsSchema" :state="settingsState" class="form-section" @submit="onSubmit('Settings')">
          <div class="form-row">
            <UFormField label="Display Name" name="displayName">
              <UInput v-model="settingsState.displayName" placeholder="Jane Doe" icon="i-lucide-user" class="w-full" />
            </UFormField>
            <UFormField label="Email" name="email">
              <UInput v-model="settingsState.email" type="email" placeholder="jane@example.com" icon="i-lucide-mail" class="w-full" />
            </UFormField>
          </div>

          <div class="form-row">
            <UFormField label="Language" name="language">
              <USelect v-model="settingsState.language" :items="languageOptions" placeholder="Select language..." class="w-full" />
            </UFormField>
            <UFormField label="Notifications" name="notifications">
              <div class="pt-2">
                <USwitch v-model="settingsState.notifications" label="Email notifications" />
              </div>
            </UFormField>
          </div>

          <UFormField label="Bio" name="bio">
            <UTextarea v-model="settingsState.bio" :rows="3" placeholder="Tell us about yourself..." class="w-full" />
          </UFormField>

          <div class="form-actions">
            <UButton variant="outline" color="neutral">Cancel</UButton>
            <UButton type="submit" icon="i-lucide-save">
              Save Changes
            </UButton>
          </div>
        </UForm>
      </AppFormCard>
    </section>

    <!-- Usage guide -->
    <section class="form-container form-wide">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-code" class="text-primary size-5" />
            <h2 class="font-display text-xl font-semibold">Usage Guide</h2>
          </div>
        </template>

        <div class="space-y-4 text-sm">
          <p>All forms use these standardized patterns. See <code>AGENTS.md</code> for the full reference.</p>

          <div class="space-y-2">
            <h3 class="font-semibold">CSS Layout Classes</h3>
            <ul class="list-disc list-inside space-y-1 text-muted">
              <li><code>.form-section</code> — Vertical flex with consistent gap between fields</li>
              <li><code>.form-row</code> — Responsive 2-column grid (stacks on mobile)</li>
              <li><code>.form-actions</code> — Right-aligned button row</li>
              <li><code>.form-actions-full</code> — Full-width buttons (login/signup)</li>
              <li><code>.form-actions-center</code> — Center-aligned buttons</li>
            </ul>
          </div>

          <div class="space-y-2">
            <h3 class="font-semibold">AppFormCard Props</h3>
            <ul class="list-disc list-inside space-y-1 text-muted">
              <li><code>title</code> / <code>description</code> / <code>icon</code> — Optional card header</li>
              <li><code>size="narrow"</code> — 24rem (auth forms)</li>
              <li><code>size="default"</code> — 32rem (general forms)</li>
              <li><code>size="wide"</code> — 40rem (multi-column forms)</li>
              <li><code>size="full"</code> — No max-width constraint</li>
            </ul>
          </div>

          <UAlert
            title="Important: Always add class=&quot;w-full&quot; to UInput, UTextarea, and USelect"
            description="Nuxt UI components need the class prop directly — CSS selectors can't reach inside their wrapper structure."
            color="warning"
            icon="i-lucide-alert-triangle"
            variant="subtle"
          />
        </div>
      </UCard>
    </section>
  </div>
</template>
