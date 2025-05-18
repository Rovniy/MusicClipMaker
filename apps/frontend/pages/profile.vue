<script setup lang="ts">
const { signOut } = useAuth()

definePageMeta({
  middleware: [ 'auth' ]
})
</script>

<template>
  <h1>Profile</h1>

  <UiButton @click="signOut">Sign out</UiButton>
</template>

<style scoped>

</style>