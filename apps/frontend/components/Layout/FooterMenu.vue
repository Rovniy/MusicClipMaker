<template>
<div class="footer_menu">
  <span class="title" v-text="props.title" />

  <ul class="list">
    <li v-for="item in props.items" :key="item.href" class="item">
      <NuxtLink :to="item.href" class="link">
        {{ item.text }}
      </NuxtLink>
    </li>
  </ul>
</div>
</template>

<script setup lang="ts">
type TItem = {
  href: string,
  text: string,
}

interface IProps {
  title: string
  items: TItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  title: 'Some titls',
  items: () => []
})
</script>

<style scoped lang="sass">
.footer_menu
  width: 100%
  +flex_start_column
  gap: 20px

  .title
    font-weight: bold
    color: var(--uicolor-white)

  .list
    padding: 0
    margin: 0
    +flex_start_column
    gap: 5px

    .item
      list-style: none
      padding: 0
      margin: 0

      .link
        text-decoration: none
        color: var(--uicolor-gray)

        &:hover
          text-decoration: none
          color: var(--uicolor-white)
</style>