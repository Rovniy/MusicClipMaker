<script setup lang="ts">
const { user, loading, signIn, signOut } = useAuth()

</script>

<template>
  <div>
    <button v-if="!user" @click="signIn">Войти через Google</button>
    <div v-else>
      <img :src="user.photoURL" alt="avatar" class="avatar"/>
      {{ user.displayName }}
      <button @click="signOut">Выйти</button>
    </div>
  </div>
</template>

<style scoped>

</style>