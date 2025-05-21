<template>
<section class="section hero">
  <h1 class="title">Turn your music into stunning visuals — <b class="highlighted">instantly</b>.</h1>
  <h4 class="sub">AltCover transforms your track and cover art into ready-to-share animated videos for Spotify, YouTube Shorts, Instagram & more.</h4>

  <div class="btn_area">
    <UiButton text="Try for free" link="/login" @click="tryItForFree" type="secondary" />
    <UiButton text="Watch Demo" @click="watchDemo" arrow />
  </div>

  <span class="slug">AltCover <b class="highlighted">|</b> Your music. In motion.</span>

  <NuxtImg src="/background/section.jpg" alt="hero" object-cover="object-cover" class="background" />
</section>
</template>

<script setup lang="ts">
const tryItForFree = () => {
  console.log('tryItForFree')
}
const watchDemo = () => {
  console.log('watchDemo')
}
</script>

<style scoped lang="sass">
.hero
  background: var(--uicolor-dark)
  height: 70vh
  min-height: 600px
  +flex_center_column

  .title
    text-align: center
    max-width: 900px
    z-index: 2

  .sub
    text-align: center
    max-width: 700px
    color: var(--uicolor-heading)
    z-index: 2

  .btn_area
    +flex_center
    gap: 10px
    z-index: 2

  .slug
    position: absolute
    bottom: 20px
    margin-top: auto
    text-align: center
    z-index: 2

  .background
    position: absolute
    top: -10px
    left: -20px
    width: 130%
    object-fit: cover
    z-index: 1
    filter: blur(5px)
</style>