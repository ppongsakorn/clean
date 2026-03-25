<template>
  <header class="flex items-center justify-between h-14 px-4 bg-surface border-b border-border shrink-0">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm">
      <span class="text-muted-foreground">{{ workspaceName }}</span>
      <template v-if="projectName">
        <span class="text-muted-foreground">/</span>
        <span class="text-foreground font-medium">{{ projectName }}</span>
      </template>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Search -->
      <button class="flex items-center gap-2 h-8 px-3 rounded-md text-xs text-muted-foreground bg-elevated border border-border hover:border-primary transition-colors">
        <Search :size="13" />
        <span class="hidden sm:inline">Search</span>
        <kbd class="hidden sm:inline text-xs text-muted-foreground">/</kbd>
      </button>

      <!-- Notifications -->
      <button class="relative h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors">
        <Bell :size="16" />
        <span
          v-if="unreadCount > 0"
          class="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- Add Task -->
      <button
        v-if="showAddTask"
        @click="$emit('addTask')"
        class="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        <Plus :size="14" />
        <span>Add Task</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Search, Bell, Plus } from 'lucide-vue-next'

defineEmits(['addTask'])

const route = useRoute()

const workspaceName = 'Clean'
const projectName = computed(() => route.meta.projectName as string | undefined)
const showAddTask = computed(() => route.path.startsWith('/projects/'))
const unreadCount = ref(0)
</script>
