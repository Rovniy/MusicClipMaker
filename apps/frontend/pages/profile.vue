<script setup lang="ts">
const signOutLogic = async () => {
  await useAuthStore().signOut()
  return useRouter().push('/')
}
definePageMeta({
  middleware: [ 'auth' ]
})
</script>

<template>
  <h1>Profile</h1>

  <UiButton @click="signOutLogic">Sign out</UiButton>
</template>

<style scoped>

</style>