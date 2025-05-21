<template>
  <section class="section  why">
    <div class="container">
      <h2 class="title">Why AltCover?</h2>
      <h4 class="desc">The simplest way to create stunning visualizers for your music</h4>

      <div class="blocks_area">
        <div class="card" v-for="item in cards" :key="item.title">
          <NuxtImg :src="item.icon" alt="why-1" class="icon_image" />
          <h3 v-text="item.title" class="title" />
          <span class="desc" v-text="item.desc" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    icon: '/content/clock.svg',
    title: 'Generate visualizers in 30 seconds',
    desc: 'No editing skills required. Just upload — we handle the rest.'
  },
  {
    icon: '/content/phone.svg',
    title: 'Perfect for all platforms',
    desc: 'Export in vertical (9:16), square (1:1), and horizontal (16:9) formats.'
  },
  {
    icon: '/content/styling.svg',
    title: 'Stylish, responsive themes',
    desc: 'Choose from curated presets to match your genre and vibe.'
  },
  {
    icon: '/content/brain.svg',
    title: 'AI-enhanced experience',
    desc: 'Smart defaults and automatic syncing with your track.'
  }
]
</script>

<style scoped lang="sass">
.why
  background: rgb(249, 250, 251)
  padding: 60px 20px
  +flex_center

  .container
    +flex_center_column

    .title
      color: var(--uicolor-black)

    .desc
      color: var(--uicolor-dark-gray)

    .blocks_area
      $gap: 20px

      margin-top: 40px
      +flex_center
      gap: $gap
      align-items: stretch
      flex-wrap: wrap

      .card
        border-radius: 10px
        background: var(--uicolor-white)
        padding: 25px
        +flex_center_column
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
        gap: 10px
        +desktop
          width: calc(25% - #{$gap})

        .icon_image
          width: 50px
          height: 50px

        .title
          text-align: center
          font-size: 20px
          margin: 10px 0 0 0
          font-weight: bold

        .desc
          text-align: center



</style>