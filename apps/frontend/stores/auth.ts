import {defineStore} from 'pinia'
import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from 'firebase/auth'
import {useNuxtApp} from '#app'
import {useFirebase} from "~/composables/useFirebase";

interface AuthState {
    providerUserData: object | null
    dbUserData: object | null
    loading: boolean
}

export const useAuthStore = defineStore('authStore', {
    state: (): AuthState => ({
        providerUserData: null,
        dbUserData: null,
        loading: false,
    }),
    getters: {
        getUser: state => state.providerUserData,
        isUserLoggedIn: state => !!state.providerUserData
    },
    actions: {
        async signOut() {
            await signOut(useNuxtApp().$auth)
            this.providerUserData = null
            this.dbUserData = null
        },
        initAuth() {
            if (!import.meta.browser) return

            const {$auth} = useNuxtApp()

            onAuthStateChanged($auth, async (user) => {
                try {
                    if (this.providerUserData) return

                    if (user) {
                        this.providerUserData = user
                        this.dbUserData = await this.getUserData(user.uid)
                        console.log('STORE : AUTH : initAuth : USER : DB Data', this.dbUserData)
                    } else {
                        this.providerUserData = null
                        this.dbUserData = null
                    }
                } catch (e) {
                    console.log('onAuthStateChanged : error', e)
                }
            })
        },
        async getUserData(uid: string): Promise<object | null> {
            try {
                this.loading = true

                const data = await useFirebase().getUserDataById(uid)
                if (!data) return useFirebase().createClearUser(uid)
                return data
            } catch (err: any) {
                return null
            } finally {
                this.loading = false
            }
        },
        async signInWithGoogle() {
            const googleProvider = new GoogleAuthProvider()
            const {$auth} = useNuxtApp()

            await signInWithPopup($auth, googleProvider)
            await useRouter().push('/dashboard')
        }
    },
})
