<template>
  <div class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center space-y-6">
      <h1 class="text-xl font-bold text-primary">Clean</h1>
      <p class="text-base text-foreground">
        Welcome back, <span class="font-semibold">{{ user?.name }}</span>
      </p>
      <p class="text-sm text-muted-foreground">Dashboard coming soon.</p>
      <button
        @click="logout"
        class="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm border border-border hover:bg-elevated transition-colors"
      >
        Sign out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
</script>
