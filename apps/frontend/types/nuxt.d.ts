import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { Functions } from 'firebase/functions'
import type { Database } from 'firebase/database'
import type { FirebaseStorage } from 'firebase/storage'

// Расширяем интерфейс NuxtApp
declare module '#app' {
	interface NuxtApp {
		$firestore: Firestore,
		$auth: Auth,
		$functions: Functions,
		$database: Database,
		$storage: FirebaseStorage,
		$recaptcha: {
			execute: (action: string) => Promise<boolean>,
		},
	}
}

// Для доступа внутри шаблонов (this.$firestore)
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$firestore: Firestore,
		$auth: Auth,
		$functions: Functions,
		$database: Database,
		$storage: FirebaseStorage,
		$recaptcha: {
			execute: (action: string) => Promise<boolean>,
		},
	}
}

declare global {
	interface Window {
		grecaptcha: any;
	}
}
