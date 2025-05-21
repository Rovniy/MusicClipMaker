<template>
  <section class="section how_it_work">
    <div class="container">
      <h2 class="title">See AltCover in Action</h2>
      <h4 class="desc">Real-time demos by real artists</h4>

      <div class="blocks_area">
        <div class="card" v-for="item in cards" :key="item.id">
          <NuxtImg :src="item.image" alt="why-1" class="picture" width="200px" height="300px" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    id: 1,
    image: '/content/video-example.jpeg',
  },
  {
    id: 2,
    image: '/content/video-example.jpeg',
  },
  {
    id: 3,
    image: '/content/video-example.jpeg',
  },
  {
    id: 4,
    image: '/content/video-example.jpeg',
  },
  {
    id: 5,
    image: '/content/video-example.jpeg',
  },
  {
    id: 6,
    image: '/content/video-example.jpeg',
  }
]
</script>

<style scoped lang="sass">
.how_it_work
  background: var(--uicolor-dark-blue)
  padding: 60px 20px
  +flex_center

  .container
    +flex_center_column

    .desc
      color: var(--uicolor-gray)

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
        width: calc(50% - #{$gap})
        +desktop
          width: calc(20% - #{$gap})

        .picture
          border-radius: 10px
</style>