<script setup>
import {meta} from '~/config'

useHead({
  titleTemplate: (title) => (title ? `${title} | ${meta.siteName}` : meta.siteName),
  meta: [
    { name: 'author', content: meta.author }
  ]
});
</script>

<template>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>
