<script setup lang="ts">
import { useLayerStore } from '@/stores/layer'
import { useToolStore } from '@/stores/tool'
import { onMounted, onUnmounted, toRefs } from 'vue'

const { recordLayer } = toRefs(useLayerStore())
const { tool } = toRefs(useToolStore())

const onMouseup = (e: MouseEvent) => {
  tool.value?.mouseup(e)
  recordLayer.value?.commit()
}

onMounted(() => {
  window.addEventListener('mouseup', onMouseup)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseup)
})
</script>

<template>
  <canvas
    @mouseover="tool.mouseover"
    @mousedown="tool.mousedown"
    @mousemove="tool.mousemove"
    @mouseout="tool.mouseout"
  />
</template>
