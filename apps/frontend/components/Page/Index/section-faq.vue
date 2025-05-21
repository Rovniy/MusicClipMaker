<template>
  <section class="section faq">
    <div class="container">
      <h2 class="title">Frequently Asked Questions</h2>
      <h4 class="desc">Everything you need to know about AltCover</h4>

      <div class="faq_container">
        <UiFaqAccordion :items="cards" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    q: 'Can I use AltCover for Spotify Canvas?',
    a: 'Yes! Just choose 9:16 format and keep video under 8s.'
  },
  {
    q: 'What formats are supported?',
    a: 'MP3, WAV, AIFF for audio. JPEG and PNG for covers.'
  },
  {
    q: 'Is rendering fast?',
    a: 'Super fast — most videos are ready in 20–60 seconds.'
  },
  {
    q: 'Is my content private?',
    a: 'Absolutely. Files are deleted automatically after processing.'
  }
]
</script>

<style scoped lang="sass">
.faq
  background: var(--uicolor-white)
  padding: 60px 20px
  +flex_center

  .container
    +flex_center_column

    .title
      color: var(--uicolor-black)

    .desc
      color: var(--uicolor-dark-gray)

    .faq_container
      max-width: 800px
      width: 100%
      margin: 40px 0 0 0
</style>