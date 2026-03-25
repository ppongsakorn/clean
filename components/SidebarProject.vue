<template>
  <div>
    <button
      @click="expanded = !expanded"
      class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
      :class="{ 'text-foreground bg-elevated border-l-2 border-primary': isActive }"
    >
      <ChevronRight v-if="!collapsed" :size="12" :class="['transition-transform shrink-0', expanded ? 'rotate-90' : '']" />
      <span
        class="w-2 h-2 rounded-full shrink-0"
        :style="{ backgroundColor: project.color || '#6B7280' }"
      />
      <span v-if="!collapsed" class="truncate font-medium flex-1 text-left">{{ project.name }}</span>
    </button>

    <div v-if="expanded && !collapsed" class="ml-4 mt-0.5 space-y-0.5">
      <NuxtLink
        :to="`/projects/${project.id}`"
        class="flex items-center gap-2 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
      >
        <LayoutList :size="12" />
        <span>Tasks</span>
      </NuxtLink>
      <NuxtLink
        :to="`/projects/${project.id}/milestones`"
        class="flex items-center gap-2 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
      >
        <Target :size="12" />
        <span>Milestones</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, LayoutList, Target } from 'lucide-vue-next'

const props = defineProps<{
  project: { id: string; name: string; color?: string | null }
  collapsed: boolean
}>()

const route = useRoute()
const expanded = ref(route.path.startsWith(`/projects/${props.project.id}`))
const isActive = computed(() => route.path.startsWith(`/projects/${props.project.id}`))
</script>
