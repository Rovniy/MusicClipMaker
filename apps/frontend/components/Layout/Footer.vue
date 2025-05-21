<template>
  <footer class="footer">
    <div class="top_area">
      <div class="container">
        <div class="col">
          <UiLogo />
          <span class="slogan">Your music. In motion.</span>

          <div class="socials_area">
            <NuxtLink v-for="item in social" :key="item.alt" :to="item.href" target="_blank" rel="noopener noreferrer" class="link">
              <NuxtImg :src="item.icon" :alt="item.alt" class="icon" />
            </NuxtLink>
          </div>
        </div>

        <div class="col">
          <LayoutFooterMenu :items="productLinks" title="Product" />
        </div>

        <div class="col">
          <LayoutFooterMenu :items="companyLinks" title="Company" />
        </div>

        <div class="col">
          <LayoutFooterMenu :items="legalLinks" title="Legal" />
        </div>
      </div>
    </div>

    <div class="bottom_area">
      <div class="container">
        <span class="copyright">
          <NuxtLink to="https://xploit.ltd" target="_blank" rel="noopener noreferrer">
            <NuxtImg src="/misc/xploit_logo.svg" alt="logo-xploit" class="logo" width="100px" height="30px" />
          </NuxtLink>
          {{ common.copyright.company }}
        </span>
        <span class="small">Create stunning music visualizers with AltCover. The perfect tool for musicians, producers, and artists to promote their music with eye-catching audio-reactive videos optimized for all social platforms.</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { common } from '#config'

const social = [
  {
    icon: '/social/instagram.svg',
    alt: 'Instagram',
    href: 'https://www.instagram.com/in/instagram',
  },
  {
    icon: '/social/youtube.svg',
    alt: 'Youtube',
    href: 'https://www.youtube.com/in/youtube',
  }
]

const productLinks = [
  {
    href: '/dashboard',
    text: 'Dashboard',
  },
  {
    href: '/pricing',
    text: 'Pricing',
  },
  {
    href: '/faq',
    text: 'Faq',
  }
]

const companyLinks = [
  {
    href: '/about',
    text: 'About',
  },
  {
    href: '/contact',
    text: 'Contact',
  }
]

const legalLinks = [
  {
    href: '/privacy-policy',
    text: 'Privacy Policy',
  }
]
</script>

<style scoped lang="sass">
.footer
  width: 100%
  padding: 40px
  +flex_start_column

  .top_area
    width: 100%

    .container
      +flex_start_column
      gap: 20px
      +desktop
        +flex_start

    .col
      width: 100%
      +desktop
        width: 25%

      .slogan
        margin: 20px 0 0 0
        display: block
        color: var(--uicolor-gray)

      .socials_area
        margin: 20px 0 0 0
        +flex_center_start
        gap: 10px

        .link
          $size: 20px

          .icon
            width: 30px
            height: 30px
            opacity: .8

          &:hover
            .icon
              opacity: 1

  .bottom_area
    width: 100%

    .container
      border-top: 1px solid var(--uicolor-semi-dark-blue)
      +flex_start_column

      .copyright
        color: var(--uicolor-light-gray)
        +flex_center_start
        gap: 10px

      .small
        font-size: 14px
        color: var(--uicolor-light-gray)

</style>
