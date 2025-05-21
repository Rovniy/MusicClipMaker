<template>
  <section class="section how_it_work">
    <div class="container">
      <h2 class="title">How It Works</h2>
      <h4 class="desc">Create your animated music cover in 3 simple steps</h4>

      <div class="blocks_area">
        <div class="card" v-for="item in cards" :key="item.title">
          <div class="icon_area">
            <NuxtImg :src="item.icon" alt="why-1" class="icon_image" />
            <span class="step_counter" v-text="item.step" />
          </div>
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
    step: 1,
    icon: '/content/upload.svg',
    title: 'Upload your audio & artwork',
    desc: 'MP3, WAV, AIFF supported'
  },
  {
    step: 2,
    icon: '/content/clean.svg',
    title: 'Pick a theme',
    desc: 'From minimal lines to cinematic pulse rings'
  },
  {
    step: 3,
    icon: '/content/share.svg',
    title: 'Download & share',
    desc: 'Get a high-quality video in under a minute'
  }
]
</script>

<style scoped lang="sass">
.how_it_work
  background: var(--uicolor-white)
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
        padding: 25px
        +flex_center_column
        gap: 10px
        +desktop
          width: calc(33.3% - #{$gap})

        .icon_area
          width: 60px
          height: 60px
          background: var(--uicolor-lightblue)
          border-radius: 50%
          position: relative
          +flex_center

          .icon_image
            $size: 35px

            width: $size
            height: $size

          .step_counter
            position: absolute
            top: -10px
            right: -10px
            background: var(--uicolor-dark)
            border-radius: 50%
            text-align: center
            padding: 5px
            display: block
            width: 30px
            height: 30px
            +flex_center

        .title
          text-align: center
          font-size: 20px
          margin: 10px 0 0 0
          font-weight: bold

        .desc
          text-align: center



</style>