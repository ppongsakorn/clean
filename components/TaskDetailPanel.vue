<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="task" class="fixed inset-0 z-40 flex justify-end">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-2xl h-full bg-surface border-l border-border flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between h-12 px-4 border-b border-border shrink-0">
            <div class="flex items-center gap-2">
              <!-- Status badge -->
              <button
                @click="statusOpen = !statusOpen"
                class="relative flex items-center gap-1.5 h-6 px-2 rounded text-xs font-medium border transition-colors hover:opacity-80"
                :style="{ color: task.status.color, borderColor: task.status.color + '40', backgroundColor: task.status.color + '15' }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :style="{ backgroundColor: task.status.color }"
                />
                {{ task.status.name }}
                <ChevronDown :size="10" />

                <!-- Status dropdown -->
                <div
                  v-if="statusOpen"
                  class="absolute top-full left-0 mt-1 w-44 bg-elevated border border-border rounded-lg shadow-lg overflow-hidden z-20"
                  @click.stop
                >
                  <button
                    v-for="s in statuses"
                    :key="s.id"
                    @click="changeStatus(s)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-surface transition-colors"
                    :class="s.id === task.statusId ? 'font-semibold' : ''"
                  >
                    <span class="w-2 h-2 rounded-sm shrink-0" :style="{ backgroundColor: s.color }" />
                    {{ s.name }}
                  </button>
                </div>
              </button>

              <!-- Priority badge -->
              <button
                @click="priorityOpen = !priorityOpen"
                class="relative flex items-center gap-1 h-6 px-2 rounded text-xs font-medium hover:bg-elevated transition-colors"
              >
                <Flag :size="11" :style="{ color: priorityColor }" />
                <span class="text-muted-foreground">{{ priorityLabel }}</span>

                <!-- Priority dropdown -->
                <div
                  v-if="priorityOpen"
                  class="absolute top-full left-0 mt-1 w-36 bg-elevated border border-border rounded-lg shadow-lg overflow-hidden z-20"
                  @click.stop
                >
                  <button
                    v-for="p in priorities"
                    :key="p.value"
                    @click="changePriority(p.value)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-surface transition-colors"
                    :class="p.value === localTask.priority ? 'font-semibold' : ''"
                  >
                    <Flag :size="11" :style="{ color: p.color }" />
                    {{ p.label }}
                  </button>
                </div>
              </button>
            </div>

            <button
              @click="$emit('close')"
              class="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
            >
              <X :size="15" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-5 space-y-5">
              <!-- Title -->
              <textarea
                ref="titleRef"
                v-model="localTask.title"
                rows="1"
                class="w-full bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none resize-none overflow-hidden leading-snug"
                placeholder="Task name"
                @input="autoResizeTitle"
                @blur="saveField('title', localTask.title)"
                @keydown.enter.prevent="titleRef?.blur()"
              />

              <!-- Meta fields grid -->
              <div class="space-y-0.5">
                <!-- Assignees -->
                <div class="flex items-center gap-3 py-1.5 rounded-md hover:bg-elevated px-2 -mx-2 transition-colors">
                  <div class="flex items-center gap-2 w-32 shrink-0">
                    <Users :size="13" class="text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Assignees</span>
                  </div>
                  <span class="text-xs text-muted-foreground">No assignees</span>
                </div>

                <!-- Due date -->
                <div class="flex items-center gap-3 py-1.5 rounded-md hover:bg-elevated px-2 -mx-2 transition-colors">
                  <div class="flex items-center gap-2 w-32 shrink-0">
                    <Calendar :size="13" class="text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Due date</span>
                  </div>
                  <input
                    type="date"
                    :value="localTask.dueDate ? localTask.dueDate.slice(0, 10) : ''"
                    class="text-xs bg-transparent text-foreground focus:outline-none cursor-pointer"
                    @change="e => saveField('dueDate', (e.target as HTMLInputElement).value || null)"
                  />
                </div>

                <!-- Progress -->
                <div class="flex items-center gap-3 py-1.5 rounded-md hover:bg-elevated px-2 -mx-2 transition-colors">
                  <div class="flex items-center gap-2 w-32 shrink-0">
                    <BarChart2 :size="13" class="text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Progress</span>
                  </div>
                  <div class="flex items-center gap-2 flex-1">
                    <div class="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="localTask.progress >= 80 ? 'bg-status-done' : 'bg-human'"
                        :style="{ width: localTask.progress + '%' }"
                      />
                    </div>
                    <span class="text-xs text-muted-foreground w-8 text-right">{{ localTask.progress }}%</span>
                  </div>
                </div>

                <!-- Human:AI -->
                <div class="flex items-center gap-3 py-1.5 rounded-md hover:bg-elevated px-2 -mx-2 transition-colors">
                  <div class="flex items-center gap-2 w-32 shrink-0">
                    <Cpu :size="13" class="text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Human:AI</span>
                  </div>
                  <div class="flex items-center gap-2 flex-1">
                    <div class="flex-1 h-1.5 rounded-full overflow-hidden flex">
                      <div class="h-full bg-human transition-all" :style="{ width: localTask.humanPercent + '%' }" />
                      <div class="h-full bg-ai transition-all flex-1" />
                    </div>
                    <span class="text-xs text-muted-foreground">{{ localTask.humanPercent }}:{{ 100 - localTask.humanPercent }}</span>
                  </div>
                </div>

                <!-- Milestone -->
                <div class="flex items-center gap-3 py-1.5 rounded-md hover:bg-elevated px-2 -mx-2 transition-colors">
                  <div class="flex items-center gap-2 w-32 shrink-0">
                    <Target :size="13" class="text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Milestone</span>
                  </div>
                  <span class="text-xs text-muted-foreground">None</span>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</p>
                <textarea
                  v-model="localTask.description"
                  rows="4"
                  placeholder="Add a description…"
                  class="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none transition-colors"
                  @blur="saveField('description', localTask.description)"
                />
              </div>

              <!-- Comments -->
              <div class="space-y-2">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Comments</p>
                <div class="bg-elevated border border-border rounded-lg px-3 py-6 flex items-center justify-center">
                  <span class="text-xs text-muted-foreground">Comments coming in a future update</span>
                </div>
              </div>

              <!-- Activity -->
              <div class="space-y-2">
                <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activity</p>
                <div class="bg-elevated border border-border rounded-lg px-3 py-6 flex items-center justify-center">
                  <span class="text-xs text-muted-foreground">Activity log coming in a future update</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, ChevronDown, Flag, Users, Calendar, BarChart2, Cpu, Target } from 'lucide-vue-next'

const props = defineProps<{
  task: any | null
  statuses: any[]
}>()

const emit = defineEmits<{
  close: []
  updated: [task: any]
}>()

const titleRef = ref<HTMLTextAreaElement | null>(null)
const statusOpen = ref(false)
const priorityOpen = ref(false)

const priorities = [
  { value: 'CRITICAL', label: 'Critical', color: '#EF4444' },
  { value: 'HIGH',     label: 'High',     color: '#F97316' },
  { value: 'NORMAL',   label: 'Normal',   color: '#3B82F6' },
  { value: 'LOW',      label: 'Low',      color: '#6B7280' },
]

const localTask = reactive<any>({})

watch(() => props.task, (t) => {
  if (t) Object.assign(localTask, JSON.parse(JSON.stringify(t)))
  statusOpen.value = false
  priorityOpen.value = false
  nextTick(() => autoResizeTitle())
}, { immediate: true })

const priorityLabel = computed(() => priorities.find(p => p.value === localTask.priority)?.label ?? 'Normal')
const priorityColor = computed(() => priorities.find(p => p.value === localTask.priority)?.color ?? '#3B82F6')

function autoResizeTitle() {
  const el = titleRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

async function saveField(field: string, value: any) {
  if (!props.task) return
  try {
    const updated = await $fetch(`/api/tasks/${props.task.id}`, {
      method: 'PATCH',
      body: { [field]: value },
    })
    Object.assign(localTask, updated)
    emit('updated', updated)
  } catch {}
}

async function changeStatus(status: any) {
  statusOpen.value = false
  localTask.status = status
  localTask.statusId = status.id
  await saveField('statusId', status.id)
}

async function changePriority(value: string) {
  priorityOpen.value = false
  localTask.priority = value
  await saveField('priority', value)
}

// Close dropdowns on outside click
onMounted(() => document.addEventListener('click', closeDropdowns))
onUnmounted(() => document.removeEventListener('click', closeDropdowns))
function closeDropdowns() {
  statusOpen.value = false
  priorityOpen.value = false
}

// Close on Esc
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.task) emit('close')
}
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.2s ease;
}
.panel-enter-active .relative,
.panel-leave-active .relative {
  transition: transform 0.25s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
.panel-enter-from .relative {
  transform: translateX(100%);
}
</style>
