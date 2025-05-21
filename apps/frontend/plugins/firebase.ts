import { type FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { common } from '#config'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

export default defineNuxtPlugin(nuxtApp => {
    const firebaseConfig = {
        apiKey: "AIzaSyCsxlSYkcC6D0GeUmMX9sSKCGGjWfoQgLE",
        authDomain: "visualizationmaker-b8ff1.firebaseapp.com",
        databaseURL: "https://visualizationmaker-b8ff1-default-rtdb.firebaseio.com",
        projectId: "visualizationmaker-b8ff1",
        storageBucket: "visualizationmaker-b8ff1.firebasestorage.app",
        messagingSenderId: "1032887726025",
        appId: "1:1032887726025:web:1480407fbdc85e5c41c218",
        measurementId: "G-7S3JR3JK25"
    }

    const app = initializeApp(firebaseConfig as FirebaseOptions)

    const authInstance = getAuth(app)
    const firestoreInstance = getFirestore()
    const functionsInstance = getFunctions(app)
    const storageInstance = getStorage(app)

    if (common.isDev) {
        const _HOST = 'localhost'

        connectAuthEmulator(authInstance, `http://${_HOST}:9099`)
        connectFunctionsEmulator(functionsInstance, _HOST, 5001)
        connectFirestoreEmulator(firestoreInstance, _HOST, 8080)
        connectStorageEmulator(storageInstance, _HOST, 9199)
    }

    nuxtApp.vueApp.provide('auth', authInstance)
    nuxtApp.provide('auth', authInstance)

    nuxtApp.vueApp.provide('firestore', firestoreInstance)
    nuxtApp.provide('firestore', firestoreInstance)

    nuxtApp.vueApp.provide('functions', functionsInstance)
    nuxtApp.provide('functions', functionsInstance)

    nuxtApp.vueApp.provide('storage', storageInstance)
    nuxtApp.provide('storage', storageInstance)
})

