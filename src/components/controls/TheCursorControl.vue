<script setup lang="ts">
import type CursorTool from '@/models/tools/CursorTool'
import { useBlockStore } from '@/stores/block'
import { useLayerStore } from '@/stores/layer'
import { useToolStore } from '@/stores/tool'
import { toRef, toRefs, type Ref, onMounted, onUnmounted, computed } from 'vue'

const { recordLayer } = toRefs(useLayerStore())
const { left: offsetX, top: offsetY } = recordLayer.value!.ctx.canvas.getBoundingClientRect()

const { block } = toRefs(useBlockStore())
const blockX = computed(() => block.value!.x + offsetX)
const blockY = computed(() => block.value!.y + offsetY)

const tool = toRef(useToolStore(), 'tool') as Ref<typeof CursorTool>

const onMousemove = (e: MouseEvent) => {
  tool.value.mousemove(e)
}

onMounted(() => {
  window.addEventListener('mousemove', onMousemove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMousemove)
})
</script>

<template>
  <div v-if="block">
    <div
      class="absolute"
      :style="{
        top: 0 + 'px',
        left: 0 + 'px',
        transform: `rotate(${block.angle}rad)`,
        transformOrigin: `${blockX + block.width / 2}px ${blockY + block.height / 2}px`
      }"
    >
      <div
        class="absolute z-40 border-2 border-neutral-500"
        :style="{
          top: blockY + 'px',
          left: blockX + 'px',
          width: block.width + 'px',
          height: block.height + 'px'
        }"
        @mousedown="tool.moving = true"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize border border-neutral-500"
        :style="{
          top: blockY + 'px',
          left: blockX + 'px'
        }"
        @mousedown="tool.resizing = 1"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nesw-resize border border-neutral-500"
        :style="{
          top: blockY + 'px',
          left: blockX + block.width + 'px'
        }"
        @mousedown="tool.resizing = 2"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize border border-neutral-500"
        :style="{
          top: blockY + block.height + 'px',
          left: blockX + block.width + 'px'
        }"
        @mousedown="tool.resizing = 3"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nesw-resize border border-neutral-500"
        :style="{
          top: blockY + block.height + 'px',
          left: blockX + 'px'
        }"
        @mousedown="tool.resizing = 4"
      ></div>

      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
        :style="{
          top: blockY - 10 + 'px',
          left: blockX - 10 + 'px'
        }"
        @mousedown="tool.rotating = true"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
        :style="{
          top: blockY - 10 + 'px',
          left: blockX + block.width + 10 + 'px'
        }"
        @mousedown="tool.rotating = true"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
        :style="{
          top: blockY + block.height + 10 + 'px',
          left: blockX + block.width + 10 + 'px'
        }"
        @mousedown="tool.rotating = true"
      ></div>
      <div
        class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
        :style="{
          top: blockY + block.height + 10 + 'px',
          left: blockX - 10 + 'px'
        }"
        @mousedown="tool.rotating = true"
      ></div>
    </div>
  </div>
</template>
