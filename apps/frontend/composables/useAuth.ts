import { ref, onUnmounted } from 'vue'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithRedirect, signOut, GoogleAuthProvider } from 'firebase/auth'

export function useAuth() {
    const { $auth } = useNuxtApp()

    console.log('$auth', $auth);
    const user = ref<User|null>(null)
    const loading = ref(true)
    const unsubscribe = onAuthStateChanged($auth, (u: any) => {
        console.log('USER :', u);
        user.value = u
        loading.value = false
    })

    onUnmounted(unsubscribe)

    const signIn = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithRedirect($auth, provider)
    }
    const signOutFunc = () => signOut($auth)

    return { user, loading, signIn, signOut: signOutFunc }
}
