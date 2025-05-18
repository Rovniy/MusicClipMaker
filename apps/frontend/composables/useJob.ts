// ~/composables/useJob.ts
import { ref } from 'vue'
import { useRouter } from '#imports'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'

export function useJob() {
    const jobId = ref<string|null>(null)
    const uploadUrls = ref<{ audio: string; cover: string }|null>(null)
    const status = ref<'queued'|'uploaded'|'processing'|'done'|null>(null)
    const videoUrl = ref<string|null>(null)
    const error = ref<string|null>(null)
    const progress = ref<number>(0)
    const router = useRouter()
    const db = getFirestore()

    // 1️⃣ Создать задачу
    async function createJob(userId: string, settings: any) {
        const { $auth } = useNuxtApp()

        const idToken = await $auth.currentUser?.getIdToken()

        type TResponse = { jobId: string; uploadUrls: { audio: string; cover: string } }
        const res : TResponse = await $fetch('https://createjob-wvazgkkkrq-uc.a.run.app', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`
            },
            body: { userId, settings },
        })
        jobId.value = res.jobId
        uploadUrls.value = res.uploadUrls
        status.value = 'queued'
    }

    // 2️⃣ Залить файлы
    async function uploadFiles(audioFile: File, coverFile: File) {
        if (!uploadUrls.value) throw new Error('Нет URL для загрузки')
        await Promise.all([
            fetch(uploadUrls.value.audio, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/octet-stream'   // ← именно так
                },
                body: audioFile,
            }),
            fetch(uploadUrls.value.cover, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/octet-stream'   // ← именно так
                },
                body: coverFile,
            }),
        ])
    }

    // 3️⃣ Уведомить бэкенд, что файлы загружены
    async function notifyUpload() {
        if (!jobId.value) throw new Error('Нет jobId')
        await $fetch('https://notifyuploadcomplete-wvazgkkkrq-uc.a.run.app', {
            method: 'POST',
            body: { jobId: jobId.value },
        })
        status.value = 'uploaded'
        // начинаем слушать прогресс
        subscribeToJob()
    }

    // 4️⃣ Подписаться на изменение статуса в Firestore
    function subscribeToJob() {
        if (!jobId.value) return
        const jobDoc = doc(db, 'jobs', jobId.value)
        onSnapshot(jobDoc, snap => {
            const data = snap.data()
            if (!data) return
            status.value = data.status
            progress.value = data.progress ?? 0;
            if (data.status === 'done' && data.videoURL) {
                videoUrl.value = data.videoURL
            }
        }, err => {
            error.value = err.message
        })
    }

    return {
        jobId,
        uploadUrls,
        status,
        videoUrl,
        error,
        createJob,
        uploadFiles,
        notifyUpload,
    }
}
