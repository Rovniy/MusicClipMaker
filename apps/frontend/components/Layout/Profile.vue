<script setup lang="ts">
const { user } = useAuth()
</script>

<template>

<div class="layout_profile">
  <UiButton href="/profile" v-if="user" :text="user.displayName" :image="user.photoURL"/>
  <UiButton v-else text="Get in touch" href="/login" />
</div>
</template>

<style scoped>

</style>