<template>
  <aside
    :class="[
      'flex flex-col h-full bg-surface border-r border-border transition-all duration-250 shrink-0',
      collapsed ? 'w-14' : 'w-60'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center h-14 px-4 border-b border-border shrink-0">
      <span class="text-primary font-bold text-base tracking-tight" v-if="!collapsed">Clean</span>
      <span class="text-primary font-bold text-base" v-else>C</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">

      <!-- Home -->
      <SidebarItem :to="'/'" :icon="Home" label="Home" :collapsed="collapsed" />
      <SidebarItem :to="'/my-tasks'" :icon="CheckSquare" label="My Tasks" :collapsed="collapsed" />

      <!-- Projects -->
      <div class="mt-4">
        <p v-if="!collapsed" class="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Projects
        </p>
        <div v-else class="border-t border-border mb-2" />

        <div v-if="projects.length === 0 && !collapsed" class="px-2 py-2 text-xs text-muted-foreground">
          No projects yet
        </div>

        <SidebarProject
          v-for="project in projects"
          :key="project.id"
          :project="project"
          :collapsed="collapsed"
        />

        <button
          v-if="!collapsed"
          @click="$emit('newProject')"
          class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
        >
          <Plus :size="14" />
          <span>New Project</span>
        </button>
      </div>

      <!-- Bottom nav -->
      <div class="mt-4 border-t border-border pt-3 space-y-0.5">
        <SidebarItem :to="'/teams'" :icon="Users" label="Teams" :collapsed="collapsed" />
        <SidebarItem :to="'/settings'" :icon="Settings" label="Settings" :collapsed="collapsed" />
      </div>
    </nav>

    <!-- User + collapse toggle -->
    <div class="border-t border-border p-2 shrink-0">
      <div class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-elevated transition-colors cursor-pointer">
        <div
          class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          :style="{ backgroundColor: user?.color || '#6B7280' }"
        >
          {{ initials }}
        </div>
        <span v-if="!collapsed" class="text-xs text-foreground font-medium truncate">{{ user?.name }}</span>
      </div>
      <button
        @click="$emit('toggle')"
        class="w-full flex items-center justify-center mt-1 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
      >
        <ChevronLeft v-if="!collapsed" :size="14" />
        <ChevronRight v-else :size="14" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Home, CheckSquare, Users, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps<{ collapsed: boolean }>()
defineEmits(['toggle', 'newProject'])

const { user } = useAuth()
const { projects, fetchProjects } = useProjects()

onMounted(fetchProjects)

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
})
</script>
