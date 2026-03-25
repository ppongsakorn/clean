<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors relative group"
    :class="{ 'text-foreground bg-elevated': isActive }"
  >
    <span
      v-if="isActive"
      class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
    />
    <component :is="icon" :size="16" class="shrink-0" />
    <span v-if="!collapsed" class="truncate">{{ label }}</span>
    <span
      v-if="collapsed"
      class="absolute left-full ml-2 px-2 py-1 bg-elevated border border-border rounded-md text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
    >
      {{ label }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  icon: any
  label: string
  collapsed: boolean
}>()

const route = useRoute()
const isActive = computed(() =>
  props.to === '/' ? route.path === '/' : route.path.startsWith(props.to)
)
</script>
