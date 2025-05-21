import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore'
import {firebase} from "#config";

export function useFirebase() {
    const db = getFirestore()

    const _createCollection = (collectionName: string) => {
        return collection(db, collectionName)
    }

    const _findById = async (collectionName: string, documentName: string) => {
        try {
            const docRef = doc(_createCollection(collectionName), documentName)
            const result = await getDoc(docRef)

            return result?.data()
        } catch (e) {
            return null
        }
    }

    async function getUserDataById(uid: string) {
        return _findById(firebase.db.user, uid)
    }

    async function createClearUser(uid: string) {
        const clearUserData = {
            uid
        }

        const docRef = doc(_createCollection(firebase.db.user), uid)
        await setDoc(docRef, clearUserData)
        return clearUserData
    }

    return {
        getUserDataById,
        createClearUser
    }
}