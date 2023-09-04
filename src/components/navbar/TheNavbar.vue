<script setup lang="ts" generic="T">
import { onMounted, onUnmounted, ref, toRefs, type Ref } from 'vue'
import type { MenuType } from '@/const/menus'

const props = defineProps<{
  menus: MenuType<T>[]
}>()
const { menus } = toRefs(props)
let selectedMenu = ref<MenuType<T> | null>(null) as Ref<MenuType<T> | null>

const windowClickHandler = () => {
  selectedMenu.value = null
}

onMounted(() => {
  window.addEventListener('click', windowClickHandler)
})

onUnmounted(() => {
  window.removeEventListener('click', windowClickHandler)
})

const emit = defineEmits<{
  (event: 'menu-action', action: T): void
}>()
</script>
<template>
  <nav class="z-50 select-none bg-neutral-700">
    <ul class="flex items-center justify-start">
      <li
        v-for="item in menus"
        :key="item.text"
        class="relative cursor-pointer px-2 py-1 transition hover:bg-zinc-600"
        :class="{
          'bg-zinc-600': selectedMenu === item
        }"
        @click.stop="selectedMenu = selectedMenu?.text === item.text ? null : item"
      >
        <span>{{ item.text }}</span>
        <ul
          class="absolute left-0 top-full w-max bg-neutral-500"
          v-show="selectedMenu?.text === item.text"
        >
          <li
            v-for="child in item.children"
            :key="child.text"
            class="px-2 py-1 transition hover:bg-neutral-400"
            :class="{ 'cursor-no-drop opacity-50 hover:!bg-neutral-500': child.disabled?.() }"
            @click.stop="
              () => {
                if (child.disabled?.()) {
                  return
                }
                emit('menu-action', child.action)
                selectedMenu = null
              }
            "
          >
            <span>{{ child.text }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
