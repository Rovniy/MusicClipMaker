<template>
  <footer class="footer">
    <span class="copyright">{{ common.copyright.company }}</span>
  </footer>
</template>

<script setup lang="ts">
import { common } from '#config'
</script>

<style scoped lang="sass">
.footer
  width: 100%
  padding: 40px
  +flex_center
  gap: 20px
  border-top: 1px solid var(--uicolor-dark-gray)

  .copyright
    color: var(--uicolor-light-gray)
</style>
