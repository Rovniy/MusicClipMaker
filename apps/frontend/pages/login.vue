<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div>
    <button v-if="!authStore.isUserLoggedIn" @click="authStore.signInWithGoogle">Sign in with Google</button>

    <div v-else>
      <img :src="authStore.getUser.photoURL" alt="avatar" class="avatar"/>
      {{ authStore.getUser.displayName }}
      <button @click="authStore.signOut">Sign out</button>
    </div>
  </div>
</template>

<style scoped>

</style>