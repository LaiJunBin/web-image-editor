<script setup lang="ts">
import { useLayerStore } from '@/stores/layer'
import { useToolStore } from '@/stores/tool'
import { nextTick, onMounted, onUnmounted, toRefs, watch } from 'vue'

const { recordLayer } = toRefs(useLayerStore())
const { tool } = toRefs(useToolStore())

const onMouseup = (e: MouseEvent) => {
  tool.value?.mouseup(e)
  if (tool.value?.autoCommit) {
    recordLayer.value?.commit()
  }
}

const updateBoundingRect = () => {
  nextTick(() => {
    if (!recordLayer.value?.ctx) return

    recordLayer.value.updateBoundingRect()
  })
}

watch(() => recordLayer.value, updateBoundingRect, { immediate: true })

onMounted(() => {
  window.addEventListener('mouseup', onMouseup)
  window.addEventListener('resize', updateBoundingRect)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseup)
  window.removeEventListener('resize', updateBoundingRect)
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
