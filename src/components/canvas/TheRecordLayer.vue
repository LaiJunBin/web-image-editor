<script setup lang="ts">
import { useLayerStore } from '@/stores/layer'
import { useToolStore } from '@/stores/tool'
import { onMounted, onUnmounted, toRefs } from 'vue'

const { recordLayer } = toRefs(useLayerStore())
const { tool } = toRefs(useToolStore())

const onMouseup = (e: MouseEvent) => {
  tool.value?.mouseup(e)
  if (tool.value?.autoCommit) {
    recordLayer.value?.commit()
  }
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
    @mouseover.stop="tool.mouseover"
    @mousedown.stop="tool.mousedown"
    @mousemove.stop="tool.mousemove"
    @mouseout.stop="tool.mouseout"
  />
</template>
