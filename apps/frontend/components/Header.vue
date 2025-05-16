<template>
  <header class="header">
    <NuxtLink to="/" class="logotype">
      <NuxtImg src="/misc/logo.svg" alt="logo" class="logo" width="160" height="26" />
    </NuxtLink>

    <div class="social">
      <NuxtLink :to="contacts.telegramLink" class="icon" rel="noreferrer" target="_blank">
        <NuxtImg src="/misc/telegram.svg" alt="telegram" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { contacts } from '~/config'
</script>

<style scoped lang="sass">
.header
  padding: 0 20px
  width: 100%
  height: var(--header_height)
  display: flex
  align-items: center
  justify-content: flex-start
  position: relative
  +desktop
    justify-content: center
    --header_height: 100px

  .logotype
    width: 160px
    line-height: 0
    transition: filter .15s ease-in-out

    .logo
      width: 100%

    &:hover
      filter: brightness(1.4)

  .social
    position: absolute
    top: 0
    right: 20px
    height: var(--header_height)
    display: flex
    align-items: center
    justify-content: flex-end
    gap: 20px
    +desktop
      right: 40px

    .icon
      width: 40px
      height: 40px

      img
        width: 100%
        height: 100%

      &:hover
        img
          filter: brightness(2)
</style>
