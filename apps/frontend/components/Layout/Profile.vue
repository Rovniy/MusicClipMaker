<template>
  <div class="layout_profile">
    <UiButton href="/profile" v-if="authStore.isUserLoggedIn" :text="authStore.getUser.displayName" :image="authStore.getUser.photoURL"/>

    <div class="btns_area" v-else>
      <UiButton text="Login" href="/login" type="secondary" />
      <UiButton text="Try for free" href="/login" arrow />
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
</script>

<style scoped lang="sass">
.btns_area
  +flex_center_end
  gap: 10px
</style>