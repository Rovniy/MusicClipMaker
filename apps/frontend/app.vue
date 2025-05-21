<script setup>
import { common } from '~/config'

onMounted(() => {
  useAuthStore().initAuth()
})

useHead({
  titleTemplate: (title) => (title ? `${title} | ${common.meta.siteName}` : common.meta.siteName),
  meta: [
    { name: 'author', content: common.meta.author }
  ]
});
</script>

<template>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>
