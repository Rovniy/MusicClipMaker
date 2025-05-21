<template>
  <section class="section  why">
    <div class="container">
      <h2 class="title">Why AltCover?</h2>
      <h4 class="desc">The simplest way to create stunning visualizers for your music</h4>

      <div class="blocks_area">
        <article class="article" v-for="item in cards" :key="item.title">
          <NuxtImg src="/content/quote.svg" alt="About us" class="quotes" />

          <p v-text="item.text" class="text" />

          <div class="author">
            <div class="left_area">
              <NuxtImg :src="item.author.avatar" alt="About us" class="avatar" width="50px" height="50px" />
            </div>
            <div class="right_area">
              <span class="author_name" v-text="item.author.name" />
              <span class="author_job small" v-text="item.author.job" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    text: 'AltCover has completely transformed my music promotion strategy. I can create professional visualizers in minutes that used to take me hours in After Effects.',
    author: {
      avatar: '/content/alex_rivera.avif',
      name: 'Alex Rivera',
      job: 'Electronic Music Producer'
    },
  },
  {
    text: 'The AI-enhanced audio analysis creates perfectly synced visuals every time. My followers have doubled since I started using AltCover for my releases.',
    author: {
      avatar: '/content/sophia_chen.jpeg',
      name: 'Sophia Chen',
      job: 'Indie Artist & Songwriter'
    },
  },
  {
    text: 'As someone with limited design skills, AltCover has been a game-changer. Now I can create beautiful visualizers for all my tracks without hiring a video editor.',
    author: {
      avatar: '/content/marcus_johnson.jpeg',
      name: 'Marcus Johnson',
      job: 'Hip-Hop Producer'
    },
  },
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

      .article
        border-radius: 10px
        background: var(--uicolor-white)
        padding: 25px
        +flex_center_column
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
        gap: 10px
        +desktop
          width: calc(33.3% - #{$gap})

        .quotes
          width: 50px
          height: 50px

        .text
          color: var(--uicolor-dark)
          text-align: center

        .author
          width: fit-content
          +flex_start
          gap: 10px

          .left_area
            $size: 50px

            width: $size
            height: $size

            .avatar
              width: $size
              height: $size
              border-radius: 50%

          .right_area
            +flex_start_column

            .author_name
              color: var(--uicolor-dark)
              font-weight: bold

            .author_job
              color: var(--uicolor-dark)
</style>