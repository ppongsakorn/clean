<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-xl font-bold text-primary tracking-tight">Clean</h1>
        <p class="text-xs text-muted-foreground mt-1">Project management for AI-first teams</p>
      </div>

      <!-- Card -->
      <div class="bg-surface rounded-lg border border-border p-6 shadow-lg">
        <h2 class="text-md font-semibold text-foreground mb-5">Sign in</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
              class="w-full h-9 px-3 rounded-md bg-elevated border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-gold transition-colors"
            />
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              class="w-full h-9 px-3 rounded-md bg-elevated border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-gold transition-colors"
            />
          </div>

          <!-- Error -->
          <p v-if="error" class="text-xs text-destructive border-l-2 border-destructive pl-3 py-1">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
