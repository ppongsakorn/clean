interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  color: string | null
}

const user = ref<AuthUser | null>(null)
const initialized = ref(false)

export function useAuth() {
  const login = async (email: string, password: string) => {
    const data = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    return data.user
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  const fetchMe = async () => {
    try {
      const data = await $fetch<{ user: AuthUser }>('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  return { user: readonly(user), initialized: readonly(initialized), login, logout, fetchMe }
}
