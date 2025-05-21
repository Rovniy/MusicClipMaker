<template>
  <div class="faq_accordion">
    <div v-for="(item, index) in props.items" :key="index" class="item">
      <button class="question" @click="toggle(index)">
        <span class="text" v-text="item.q" />
        <NuxtImg class="icon" :src="openIndexes.has(index) ? minusIcon : plusIcon" alt="faq-icon" />
      </button>

      <transition name="faq">
        <div v-show="openIndexes.has(index)" class="answer">
          <span v-text="item.a"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import plusIcon from '~/assets/images/content/plus.svg'
import minusIcon from '~/assets/images/content/minus.svg'

import {ref, defineProps} from 'vue'

const props = defineProps<{
  items: { q: string, a: string }[]
}>()

const openIndexes = ref(new Set<number>([0]))

function toggle(index: number) {
  if (openIndexes.value.has(index)) {
    openIndexes.value.delete(index)
  } else {
    openIndexes.value.add(index)
  }

  openIndexes.value = new Set([...openIndexes.value])
}
</script>

<style lang="sass" scoped>
.faq_accordion
  display: flex
  flex-direction: column
  gap: 16px
  padding: 0
  width: 100%

  .item
    border-bottom: 1px solid #e0e0e0
    padding-bottom: 12px

  .question
    width: 100%
    display: flex
    justify-content: space-between
    align-items: center
    background: none
    border: none
    padding: 8px 0
    cursor: pointer
    color: var(--uicolor-dark)

    .text
      font-size: 22px
      font-weight: 600

    .icon
      $size: 16px

      width: $size
      height: $size
      transition: transform 0.2s ease

  .answer
    font-size: 16px
    line-height: 24px
    color: #444
    margin-top: 8px
    overflow: hidden
    transition: max-height 0.2s ease, opacity 0.2s ease

.faq-enter-active,
.faq-leave-active
  transition: max-height 0.2s ease, opacity 0.2s ease

.faq-enter-from,
.faq-leave-to
  max-height: 0
  opacity: 0

.faq-enter-to,
.faq-leave-from
  max-height: 500px
  opacity: 1
</style>
