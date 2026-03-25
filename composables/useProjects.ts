interface Project {
  id: string
  name: string
  color: string | null
}

const projects = ref<Project[]>([])

export function useProjects() {
  const fetchProjects = async () => {
    try {
      const data = await $fetch<Project[]>('/api/projects')
      projects.value = data
    } catch {
      projects.value = []
    }
  }

  const addProject = (project: Project) => {
    projects.value = [...projects.value, project]
  }

  return { projects: readonly(projects), fetchProjects, addProject }
}
