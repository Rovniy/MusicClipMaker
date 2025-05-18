<template>
  <NuxtLink to="/" class="ui_logo">
    <NuxtImg src="/misc/altcover_logo.svg" alt="Altcover logo" class="logo" />
  </NuxtLink>
</template>

<script setup lang="ts">

</script>

<style scoped lang="sass">
.ui_logo
  width: fit-content
  +flex_center
  padding: 0
  margin: 0
  opacity: .8
  transition: opacity .2s ease-in-out
  text-decoration: none

  .logo
    width: 150px

  &:hover
    text-decoration: none
    opacity: 1


</style>