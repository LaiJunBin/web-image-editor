<script setup lang="ts">
import { useLayerStore } from '@/stores/layer'
import { useSettingStore } from '@/stores/setting'
import { nextTick, onMounted, onUnmounted, ref, toRaw, toRefs } from 'vue'
import { Layer } from '@/models/Layer'

const { sortedLayers, recordLayer } = toRefs(useLayerStore())
const { settings } = useSettingStore()
const createLayerRef = (layer: Layer) => {
  return (e: { $el: HTMLCanvasElement } | null) => {
    if (!e) {
      return
    }
    const { $el } = e
    layer.ref = $el
    layer.init()
    layer.render()
  }
}

const onWheel = async (e: WheelEvent) => {
  const delta = e.deltaY
  settings.scale = settings.scale - Math.floor(delta / 10)
  await nextTick()

  recordLayer.value?.updateBoundingRect()
}

const isMouseDown = ref(false)
const onMousemove = async (e: MouseEvent) => {
  if (!isMouseDown.value || !isSpaceKeyPressed.value) return
  const scale = settings.scale / 100
  const { movementX, movementY } = e
  settings.translateX += movementX / scale
  settings.translateY += movementY / scale
  await nextTick()

  recordLayer.value?.updateBoundingRect()
}

const isSpaceKeyPressed = ref(false)
const isAltKeyPressed = ref(false)
const onKeydown = (e: KeyboardEvent) => {
  resetKeydown()

  if (e.key === ' ') {
    recordLayer.value?.restore()
    isSpaceKeyPressed.value = true
  }

  if (e.key === 'Alt') {
    e.preventDefault()
    isAltKeyPressed.value = true
  }
}
const onKeyup = () => {
  resetKeydown()
}

const resetKeydown = () => {
  isSpaceKeyPressed.value = false
  isAltKeyPressed.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('keyup', onKeyup)
})
</script>

<template>
  <main class="relative h-full w-full">
    <section
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{
        transform: `scale(${settings.scale / 100}) translate(${settings.translateX}px, ${
          settings.translateY
        }px)`
      }"
    >
      <!-- eslint-disable-next-line vue/no-useless-template-attributes -->
      <template v-for="layer in sortedLayers" :key="layer.name" v-memo="[layer]">
        <component
          :is="layer.component"
          class="absolute -translate-x-1/2 -translate-y-1/2"
          :width="settings.width"
          :height="settings.height"
          :style="{ zIndex: layer.order }"
          :ref="createLayerRef(toRaw(layer) as Layer)"
        />
      </template>
    </section>

    <div
      class="absolute left-0 top-0 z-40 h-full w-full cursor-grab"
      v-show="isSpaceKeyPressed"
      @mousedown="isMouseDown = true"
      @mousemove="onMousemove"
      @mouseup="isMouseDown = false"
      @mouseout="isMouseDown = false"
    ></div>

    <div
      class="absolute left-0 top-0 z-40 h-full w-full"
      :class="{
        'pointer-events-none': !isAltKeyPressed
      }"
      @wheel.alt.prevent="onWheel"
      @mousemove.exact="isAltKeyPressed = false"
      @mousemove.alt="isAltKeyPressed = true"
    ></div>
  </main>
</template>
