<template>
  <component
      :is="targetComponent"
      :href="btnLink"
      :class="[
        'ui_button',
        props.type,
        { 'arrow': props.arrow },
        {
          disabled: props.disabled,
          loading: props.loading,
        }
      ]"
      :aria-disabled="disabled"
      @click="emit('click')">

    <span v-if="props.text" class="text" v-html="props.text"/>

    <span class="text" v-else>
      <slot/>
    </span>

    <div class="circle">
      <img :src="props.image" class="avatar" v-if="props?.image" alt="avatar" />

      <template v-else>
        <div class="top_layer">
          <NuxtImg src="/btn_arrow.svg" alt="Arrow" class="arrow" width="20" height="20"/>
        </div>
        <div class="bottom_layer">
          <NuxtImg src="/btn_arrow.svg" alt="Arrow" class="arrow" width="20" height="20"/>
        </div>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import {NuxtLink} from '#components'

const emit = defineEmits([ 'click' ])

interface IProps {
  text?: string | undefined
  type?: 'default' | 'secondary' | 'ghost'
  link?: string | undefined
  disabled?: boolean
  loading?: boolean
  image?: string | undefined,
  arrow?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  text: undefined,
  type: 'default',
  link: undefined,
  disabled: false,
  loading: false,
  image: undefined,
  arrow: false
})

const btnLink = computed(() => props.link ? props.link : '#')
const targetComponent = computed(() => {
  if (btnLink.value.includes('https://')) return 'a'

  return NuxtLink
})
</script>

<style scoped lang="sass">
.ui_button
  --height: 48px
  $size: 32px
  $arrow_size: 20px

  +flex_center
  padding: 10px 20px
  height: var(--height)
  border-radius: var(--height)
  background: var(--uicolor-lightblue)
  text-decoration: none
  gap: 10px
  width: fit-content

  span
    color: var(--uicolor-black)

  .circle
    pointer-events: none
    width: $size
    height: $size
    background: var(--uicolor-black)
    border-radius: 50%
    display: none
    overflow: hidden
    position: relative

    .top_layer, .bottom_layer
      position: absolute
      top: 0
      left: 0
      width: $size
      height: $size
      transition: all 0.3s ease-in-out
      +flex_center

      .arrow
        width: $arrow_size
        height: $arrow_size

    .top_layer
      transform: translateX(0) translateY(0)

    .bottom_layer
      transform: translateX(-$size) translateY($size)


  .avatar
    min-height: $size
    min-width: $size
    object-fit: cover

  &.arrow
    padding: 10px 10px 10px 20px

    span
      color: var(--uicolor-white)

    .circle
      +flex_center

  &.secondary
    background: var(--uicolor-white)

    span
      color: var(--uicolor-black)



  &:hover
    background: var(--uicolor-lightblue)

    span
      color: var(--uicolor-white)

    .circle
      .top_layer
        transform: translateX($size) translateY(-$size)

      .bottom_layer
        transform: translateX(0) translateY(0)

    &.arrow
      background: var(--uicolor-lightblue)
</style>