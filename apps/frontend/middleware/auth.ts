export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (authStore.loading) return

    if (!authStore.getUser) {
        return navigateTo('/login')
    }
})
