<script setup lang="ts">
import type CursorTool from '@/models/tools/CursorTool'
import { useBlockStore } from '@/stores/block'
import { useLayerStore } from '@/stores/layer'
import { useSettingStore } from '@/stores/setting'
import { useToolStore } from '@/stores/tool'
import { toRef, toRefs, type Ref, onMounted, onUnmounted, computed } from 'vue'

const { recordLayer } = toRefs(useLayerStore())
const { settings } = useSettingStore()
const { block } = toRefs(useBlockStore())
const blockX = computed(
  () => recordLayer.value!.boundingRect.left + block.value!.x * (settings.scale / 100)
)
const blockY = computed(
  () => recordLayer.value!.boundingRect.top + block.value!.y * (settings.scale / 100)
)

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
  <Teleport to="body">
    <div v-if="block">
      <div
        class="absolute"
        :style="{
          top: 0 + 'px',
          left: 0 + 'px',
          transform: `rotate(${block.angle}rad) scale(${settings.scale / 100})`,
          transformOrigin: `${blockX + (block.width * (settings.scale / 100)) / 2}px ${
            blockY + (block.height * (settings.scale / 100)) / 2
          }px`
        }"
      >
        <div
          class="absolute z-40 border-2 border-neutral-500"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + 'px',
            width: block.width + 'px',
            height: block.height + 'px'
          }"
          @mousedown="tool.moving = true"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize border border-neutral-500"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + 'px'
          }"
          @mousedown="tool.resizing = 1"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nesw-resize border border-neutral-500"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + block.width + 'px'
          }"
          @mousedown="tool.resizing = 2"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize border border-neutral-500"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 + block.height + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + block.width + 'px'
          }"
          @mousedown="tool.resizing = 3"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-nesw-resize border border-neutral-500"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 + block.height + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + 'px'
          }"
          @mousedown="tool.resizing = 4"
        ></div>

        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 - 10 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 - 10 + 'px'
          }"
          @mousedown="tool.rotating = true"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
          :style="{
            top: blockY + (block.height * (settings.scale / 100 - 1)) / 2 - 10 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + block.width + 10 + 'px'
          }"
          @mousedown="tool.rotating = true"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
          :style="{
            top:
              blockY + (block.height * (settings.scale / 100 - 1)) / 2 + block.height + 10 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 + block.width + 10 + 'px'
          }"
          @mousedown="tool.rotating = true"
        ></div>
        <div
          class="absolute z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-grab"
          :style="{
            top:
              blockY + (block.height * (settings.scale / 100 - 1)) / 2 + block.height + 10 + 'px',
            left: blockX + (block.width * (settings.scale / 100 - 1)) / 2 - 10 + 'px'
          }"
          @mousedown="tool.rotating = true"
        ></div>
      </div>
    </div>
  </Teleport>
</template>
