<script setup lang="ts">
import { useLayerStore } from '@/stores/layer'
import { useSettingStore } from '@/stores/setting'
import { toRefs } from 'vue'
import { Layer } from '@/models/Layer'

const { layers } = toRefs(useLayerStore())
const { settings } = toRefs(useSettingStore())

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
</script>

<template>
  <main class="relative h-full w-full">
    <section class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <template v-for="layer in layers" :key="layer.name">
        <component
          :is="layer.component"
          class="absolute -translate-x-1/2 -translate-y-1/2"
          :width="settings.width"
          :height="settings.height"
          :style="{ zIndex: layer.order }"
          :ref="createLayerRef(layer as Layer)"
        />
      </template>
    </section>
  </main>
</template>
