export default defineNuxtRouteMiddleware((to, from) => {
    const { user, loading } = useAuth()

    if (loading.value) return

    if (!user.value) {
        return navigateTo('/login')
    }
})
