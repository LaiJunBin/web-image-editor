<script setup lang="ts">
import type SelectionTool from '@/models/tools/SelectionTool'
import { useToolStore } from '@/stores/tool'
import { toRef, type Ref, onMounted, onUnmounted, ref } from 'vue'

const tool = toRef(useToolStore(), 'tool') as Ref<typeof SelectionTool>
const clearFn = ref<() => void>(tool.value.clear)

const onMousemove = (e: MouseEvent) => {
  tool.value.mousemove(e)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'j') {
    e.preventDefault()
    tool.value.copyToLayer()
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMousemove)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMousemove)
  window.removeEventListener('keydown', onKeydown)
  clearFn.value()
})
</script>

<template>
  <template />
</template>
