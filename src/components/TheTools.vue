<script setup lang="ts">
import { Tool } from '@/models/Tool'
import { useSettingStore } from '@/stores/setting'
import { useToolStore } from '@/stores/tool'
import { toRefs } from 'vue'

const props = defineProps<{
  tools: Tool[]
}>()
const { tools } = toRefs(props)

const { setTool } = useToolStore()
const { color } = toRefs(useSettingStore())

const openColorPicker = () => {
  const input = document.createElement('input')
  input.type = 'color'
  input.value = color.value.replace(/rgba\((\d+), (\d+), (\d+), (\d+)\)/, (match, r, g, b, a) => {
    return `#${parseInt(r).toString(16)}${parseInt(g).toString(16)}${parseInt(b).toString(16)}`
  })
  input.addEventListener('input', () => {
    color.value = input.value
  })
  input.click()
}
</script>

<template>
  <div class="z-30 flex flex-col items-start justify-center">
    <button
      v-for="tool in tools"
      :key="tool.name"
      class="bg-neutral-700 px-2 py-1 transition hover:bg-neutral-600"
      :class="{
        '!bg-neutral-500': tool.isActive
      }"
      @click="setTool(tool)"
    >
      <component :is="tool.component" />
    </button>
    <div class="flex h-8 w-10 items-center justify-center bg-neutral-700">
      <div class="h-6 w-6" :style="`background-color: ${color}`" @click="openColorPicker"></div>
    </div>
  </div>
</template>
