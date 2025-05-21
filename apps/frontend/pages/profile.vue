<template>
  <div class="container">
    <h1>Profile</h1>

    <UiButton @click="signOutLogic">Sign out</UiButton>
  </div>
</template>

<script setup lang="ts">
const signOutLogic = async () => {
  await useAuthStore().signOut()
  return useRouter().push('/')
}
definePageMeta({
  middleware: [ 'auth' ]
})
</script>



<style scoped>

</style>