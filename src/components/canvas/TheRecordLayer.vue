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

const resetOffset = () => {
  nextTick(() => {
    if (!recordLayer.value?.ctx) return
    const rect = recordLayer.value!.ctx.canvas.getBoundingClientRect()
    setOffset(rect.left, rect.top)
  })
}

const { setOffset } = useLayerStore()
watch(() => recordLayer.value, resetOffset, { immediate: true })

onMounted(() => {
  window.addEventListener('mouseup', onMouseup)
  window.addEventListener('resize', resetOffset)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseup)
  window.removeEventListener('resize', resetOffset)
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
