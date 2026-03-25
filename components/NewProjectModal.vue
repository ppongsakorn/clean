<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self="$emit('update:modelValue', false)"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" />

      <!-- Modal -->
      <div class="relative z-10 w-full max-w-md bg-surface border border-border rounded-xl shadow-xl p-6 mx-4">
        <h2 class="text-sm font-semibold text-foreground mb-4">New Project</h2>

        <form @submit.prevent="submit" class="space-y-4">
          <!-- Name -->
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground">Project Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. Roadmap 2026"
              autofocus
              class="w-full h-9 px-3 rounded-md bg-elevated border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <!-- Color -->
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground">Color</label>
            <div class="flex items-center gap-2">
              <button
                v-for="color in colorOptions"
                :key="color"
                type="button"
                @click="form.color = color"
                class="w-6 h-6 rounded-full ring-offset-2 ring-offset-surface transition-all"
                :class="form.color === color ? 'ring-2 ring-primary' : 'ring-0'"
                :style="{ backgroundColor: color }"
              />
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="$emit('update:modelValue', false)"
              class="h-8 px-4 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !form.name.trim()"
              class="h-8 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Creating…' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  created: [project: { id: string; name: string; color: string | null }]
}>()

const colorOptions = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#14B8A6', '#6B7280',
]

const form = reactive({ name: '', color: '#3B82F6' })
const loading = ref(false)
const error = ref('')

watch(() => props.modelValue, (val) => {
  if (val) {
    form.name = ''
    form.color = '#3B82F6'
    error.value = ''
  }
})

async function submit() {
  if (!form.name.trim()) return
  loading.value = true
  error.value = ''
  try {
    const project = await $fetch<{ id: string; name: string; color: string | null }>('/api/projects', {
      method: 'POST',
      body: { name: form.name.trim(), color: form.color },
    })
    emit('created', project)
    emit('update:modelValue', false)
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to create project'
  } finally {
    loading.value = false
  }
}
</script>
