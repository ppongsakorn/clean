export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const { user, initialized, fetchMe } = useAuth()

  if (!initialized.value) {
    await fetchMe()
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
