<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-lg font-semibold text-foreground">Home</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Welcome back, <span class="text-foreground font-medium">{{ user?.name }}</span>
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-surface border border-border rounded-lg p-4 space-y-1">
        <p class="text-xs text-muted-foreground uppercase tracking-wide">My Tasks</p>
        <p class="text-2xl font-bold text-foreground">—</p>
      </div>
      <div class="bg-surface border border-border rounded-lg p-4 space-y-1">
        <p class="text-xs text-muted-foreground uppercase tracking-wide">In Progress</p>
        <p class="text-2xl font-bold text-foreground">—</p>
      </div>
      <div class="bg-surface border border-border rounded-lg p-4 space-y-1">
        <p class="text-xs text-muted-foreground uppercase tracking-wide">Due This Week</p>
        <p class="text-2xl font-bold text-foreground">—</p>
      </div>
    </div>

    <div class="bg-surface border border-border rounded-lg p-8 flex flex-col items-center justify-center text-center gap-3">
      <div class="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
        <LayoutDashboard :size="20" class="text-muted-foreground" />
      </div>
      <p class="text-sm font-medium text-foreground">Dashboard coming in a future update</p>
      <p class="text-xs text-muted-foreground max-w-xs">
        Your activity feed, recent tasks, and team updates will appear here.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'

const { user } = useAuth()
</script>
