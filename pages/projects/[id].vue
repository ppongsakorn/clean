<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center gap-2 px-4 h-10 border-b border-border shrink-0">
      <button class="flex items-center gap-1.5 h-7 px-2.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors">
        <Filter :size="12" />
        <span>Filter</span>
      </button>
      <button class="flex items-center gap-1.5 h-7 px-2.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors">
        <Users :size="12" />
        <span>Assignee</span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <!-- Loading -->
      <div v-if="pending" class="p-4 space-y-3">
        <div v-for="i in 3" :key="i" class="space-y-1">
          <div class="h-6 w-32 bg-elevated rounded animate-pulse" />
          <div v-for="j in 2" :key="j" class="h-9 bg-elevated rounded animate-pulse" />
        </div>
      </div>

      <!-- Empty project (no statuses yet) -->
      <div
        v-else-if="statuses.length === 0"
        class="flex flex-col items-center justify-center h-full gap-4 py-24"
      >
        <div class="w-16 h-16 rounded-2xl bg-elevated flex items-center justify-center">
          <CheckSquare :size="28" class="text-muted-foreground" />
        </div>
        <p class="text-sm font-medium text-foreground">No tasks yet</p>
        <p class="text-xs text-muted-foreground">Create your first task to get started</p>
      </div>

      <!-- Status groups -->
      <div v-else class="p-4 space-y-4">
        <div
          v-for="status in statuses"
          :key="status.id"
          class="space-y-0.5"
        >
          <!-- Group header -->
          <div
            class="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-elevated transition-colors"
            @click="toggleGroup(status.id)"
          >
            <ChevronRight
              :size="12"
              class="text-muted-foreground transition-transform shrink-0"
              :class="collapsed[status.id] ? '' : 'rotate-90'"
            />
            <span class="w-2 h-2 rounded-sm shrink-0" :style="{ backgroundColor: status.color }" />
            <span class="text-xs font-semibold text-foreground uppercase tracking-wide">{{ status.name }}</span>
            <span class="text-xs text-muted-foreground">{{ tasksByStatus[status.id]?.length ?? 0 }}</span>
          </div>

          <!-- Task rows -->
          <template v-if="!collapsed[status.id]">
            <div
              v-for="task in tasksByStatus[status.id] ?? []"
              :key="task.id"
              class="flex items-center gap-2 px-2 py-2 ml-4 rounded-md hover:bg-elevated transition-colors cursor-pointer"
              @click="openPanel(task)"
            >
              <button
                class="w-3.5 h-3.5 rounded-sm border-2 shrink-0"
                :style="{ borderColor: status.color }"
                @click.stop
              />
              <span class="text-xs text-foreground flex-1 truncate">{{ task.title }}</span>
              <Flag
                v-if="task.priority !== 'NORMAL'"
                :size="11"
                :style="{ color: priorityColor(task.priority) }"
                class="shrink-0"
              />
            </div>

            <!-- Inline add row -->
            <div v-if="addingToStatus === status.id" class="ml-4">
              <div class="flex items-center gap-2 px-2 py-1.5 rounded-md bg-elevated border border-primary/40">
                <div class="w-3.5 h-3.5 rounded-sm border-2 shrink-0" :style="{ borderColor: status.color }" />
                <input
                  :ref="el => setInputRef(status.id, el)"
                  v-model="newTaskTitle"
                  type="text"
                  placeholder="Task name"
                  class="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  @keydown.enter="saveTask(status)"
                  @keydown.esc="cancelAdd"
                />
                <span class="text-xs text-muted-foreground">Enter ↵</span>
              </div>
            </div>

            <!-- Add task button -->
            <button
              v-else
              @click="startAdding(status.id)"
              class="flex items-center gap-1.5 ml-4 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors w-full"
            >
              <Plus :size="12" />
              <span>Add Task</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Task detail panel -->
    <TaskDetailPanel
      :task="selectedTask"
      :statuses="statuses"
      @close="selectedTask = null"
      @updated="onTaskUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { Filter, Users, CheckSquare, Plus, ChevronRight, Flag } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const route = useRoute()
const projectId = route.params.id as string

const { data: project } = await useFetch<{ id: string; name: string; color: string | null }>(`/api/projects/${projectId}`)

useHead({ title: () => project.value?.name ?? 'Project' })

watchEffect(() => {
  if (project.value) route.meta.projectName = project.value.name
})

const { data: statusesData, pending } = await useFetch<any[]>(`/api/projects/${projectId}/statuses`)
const { data: tasksData } = await useFetch<any[]>(`/api/projects/${projectId}/tasks`)

const statuses = computed(() => statusesData.value ?? [])

const tasksByStatus = computed(() => {
  const map: Record<string, any[]> = {}
  for (const t of tasksData.value ?? []) {
    if (!map[t.statusId]) map[t.statusId] = []
    map[t.statusId].push(t)
  }
  return map
})

// Collapse state
const collapsed = reactive<Record<string, boolean>>({})
function toggleGroup(statusId: string) {
  collapsed[statusId] = !collapsed[statusId]
}

// Inline add
const addingToStatus = ref<string | null>(null)
const newTaskTitle = ref('')
const inputRefs: Record<string, HTMLInputElement | null> = {}

function setInputRef(statusId: string, el: any) {
  inputRefs[statusId] = el
}

function startAdding(statusId: string) {
  addingToStatus.value = statusId
  newTaskTitle.value = ''
  nextTick(() => inputRefs[statusId]?.focus())
}

function cancelAdd() {
  addingToStatus.value = null
  newTaskTitle.value = ''
}

async function saveTask(status: any) {
  const title = newTaskTitle.value.trim()
  if (!title) return cancelAdd()
  try {
    const task = await $fetch('/api/tasks', {
      method: 'POST',
      body: { title, projectId, statusId: status.id },
    })
    if (!tasksData.value) tasksData.value = []
    tasksData.value.push(task)
    newTaskTitle.value = ''
    nextTick(() => inputRefs[status.id]?.focus())
  } catch {}
}

// Task detail panel
const selectedTask = ref<any | null>(null)

function openPanel(task: any) {
  selectedTask.value = task
}

function onTaskUpdated(updated: any) {
  if (!tasksData.value) return
  const idx = tasksData.value.findIndex(t => t.id === updated.id)
  if (idx !== -1) tasksData.value[idx] = updated
  if (selectedTask.value?.id === updated.id) selectedTask.value = updated
}

// Priority color helper
function priorityColor(p: string) {
  const map: Record<string, string> = {
    CRITICAL: '#EF4444', HIGH: '#F97316', NORMAL: '#3B82F6', LOW: '#6B7280',
  }
  return map[p] ?? '#3B82F6'
}
</script>
