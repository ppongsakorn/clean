<template>
  <div class="flex h-screen bg-background overflow-hidden">
    <AppSidebar
      :collapsed="sidebarCollapsed"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @newProject="showNewProject = true"
    />
    <div class="flex flex-col flex-1 min-w-0">
      <AppTopBar @addTask="handleAddTask" />
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>

  <NewProjectModal
    v-model="showNewProject"
    @created="onProjectCreated"
  />
</template>

<script setup lang="ts">
const sidebarCollapsed = ref(false)
const showNewProject = ref(false)

const { addProject } = useProjects()
const router = useRouter()

function onProjectCreated(project: { id: string; name: string; color: string | null }) {
  addProject(project)
  router.push(`/projects/${project.id}`)
}

function handleAddTask() {
  // will be handled by the project page via provide/inject in a later increment
}
</script>
