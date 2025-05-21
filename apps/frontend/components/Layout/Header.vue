<template>
  <header class="header">
    <div class="logo_area">
      <UiLogo />
    </div>

    <div class="menu_area">
      <NuxtLink to="/dashboard" class="link">Create</NuxtLink>
      <NuxtLink to="/pricing" class="link">Pricing</NuxtLink>
      <NuxtLink to="/about" class="link">About</NuxtLink>
    </div>

    <div class="login_area">
      <LayoutProfile />
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped lang="sass">
.header
  $height: 68px

  width: 100%
  +flex_space_between
  padding: 20px 30px

  .menu_area
    padding: 10px 20px
    height: $height
    border-radius: $height
    +flex_center
    gap: 10px

    .link
      padding: 10px 20px
      color: var(--uicolor-white)
      text-decoration: none

      &:hover
        color: var(--uicolor-lightblue)
        text-decoration: none
</style>
