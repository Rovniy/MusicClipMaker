<template>
  <section class="section seo_text">
    <div class="container">
      <h2 class="title">Ready to transform your music?</h2>
      <h4 class="desc">Join thousands of artists who are using AltCover to create stunning visualizers and grow their audience.</h4>

      <p>
        AltCover is the fastest way to create animated music videos online. Whether you’re an indie musician, a producer, or a band manager, you can generate dynamic music visualizations with just one click. Our tool supports multiple formats and resolutions, making it perfect for Spotify Canvas, Instagram Reels, TikTok, YouTube Shorts, and more.
      </p>

      <p>
        If you’re looking for a music visualizer, cover art video generator, or a tool to convert your songs into videos, AltCover is for you. We help artists stay on-brand and share high-quality visual content without expensive editing software or freelancers. With cloud rendering and mobile-ready themes, AltCover is the go-to platform for music video automation.
      </p>

      <p>
        Try AltCover for free and join thousands of artists creating better, faster promo visuals.
      </p>

      <UiButton link="/dashboard" arrow type="secondary">Get started for free</UiButton>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="sass">
.seo_text
  background: linear-gradient(to right, #2B9DD7, #2563eb)
  padding: 60px 20px
  +flex_center

  .container
    +flex_center_column
    text-align: center

    .title
      color: var(--uicolor-white)

    .desc
      text-align: center
      color: var(--uicolor-white)
</style>