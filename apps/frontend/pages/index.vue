<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-xl font-bold mb-4">Создать видео</h1>

    <form @submit.prevent="onSubmit">
      <label>Аудио</label>
      <input type="file" accept="audio/*" @change="onAudio" required />

      <label>Обложка</label>
      <input type="file" accept="image/*" @change="onCover" required />

      <!-- Пример одного из настроек -->
      <label>Длительность</label>
      <select v-model="settings.duration">
        <option value="8">8 сек</option>
        <option value="full">Полная длина трека</option>
      </select>

      <!-- Добавьте остальные настройки: формат кадра, тема, звук on/off, текст -->

      <button type="submit" :disabled="isWorking" class="mt-4 btn">
        {{ isWorking ? 'Загрузка...' : 'Создать' }}
      </button>
    </form>

    <div v-if="status">
      <p>Статус: {{ status }}</p>
      <video v-if="videoUrl" :src="videoUrl" controls class="mt-4 w-full"></video>
    </div>

    <p v-if="error" class="text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJob } from '~/composables/useJob'

const { createJob, uploadFiles, notifyUpload, status, videoUrl, error } = useJob()

const audioFile = ref<File|null>(null)
const coverFile = ref<File|null>(null)
const settings = ref({
  duration: '8',
  format: '9:16',
  theme: 'Classic Wave',
  mute: false,
  titleEnabled: true,
  titleText: '',
  artistEnabled: false,
  artistText: '',
})

const isWorking = ref(false)

function onAudio(e: Event) {
  audioFile.value = (e.target as HTMLInputElement).files?.[0] || null
}
function onCover(e: Event) {
  coverFile.value = (e.target as HTMLInputElement).files?.[0] || null
}

async function onSubmit() {
  if (!audioFile.value || !coverFile.value) return

  isWorking.value = true
  try {
    // 1. Создать задачу и получить URL-ы
    await createJob('testUser123', settings.value)

    // 2. Залить audio и cover
    await uploadFiles(audioFile.value, coverFile.value)

    // 3. Уведомить бэкенд
    await notifyUpload()

    // дальше onSnapshot в подписке обновит status и videoUrl
  } catch (e: any) {
    error.value = e.message
  } finally {
    isWorking.value = false
  }
}
</script>

<style scoped>
</style>
