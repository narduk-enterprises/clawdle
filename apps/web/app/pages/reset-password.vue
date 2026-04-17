<script setup lang="ts">
useSeo({
  title: 'Reset Password',
  description: 'Request a password reset link or set a new password after recovery.',
})

useWebPageSchema({
  name: 'Reset Password',
  description: 'Request a password reset link or set a new password after recovery.',
})
</script>

<template>
  <AuthResetPasswordCard />
</template>
