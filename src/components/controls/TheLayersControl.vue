<script setup lang="ts">
import type { Layer } from '@/models/Layer'
import { useLayerStore } from '@/stores/layer'
import { ref, toRefs } from 'vue'

const { sortedLayers, currentLayer, addLayer, selectedLayer, destroyLayer } = toRefs(
  useLayerStore()
)
const dragLayer = ref<Layer | null>(null)

const onDragstart = (layer: Layer) => {
  if (layer.reorderable) {
    dragLayer.value = layer
  }
}

const onDragover = (layer: Layer) => {
  if (!layer.reorderable) {
    return
  }

  ;[dragLayer.value!.order, layer.order] = [layer.order, dragLayer.value!.order]
}

const onDrop = () => {
  dragLayer.value = null
}
</script>

<template>
  <h1 class="flex items-center">
    <span class="text-2xl font-bold">圖層</span>
    <button
      class="ml-2 flex h-6 w-6 items-center justify-center rounded-sm border border-neutral-500 transition hover:bg-neutral-600"
      @click="() => addLayer()"
    >
      +
    </button>
  </h1>
  <hr class="my-2" />

  <div class="flex flex-col-reverse">
    <template v-for="layer in sortedLayers" :key="layer.name">
      <div
        v-if="layer.visible"
        class="flex cursor-pointer select-none items-center border border-neutral-500"
        :class="{ 'bg-neutral-600': currentLayer === layer }"
        @click="selectedLayer(layer)"
        :draggable="layer.reorderable"
        @dragstart="onDragstart(layer as Layer)"
        @dragover.prevent="onDragover(layer as Layer)"
        @drop="onDrop"
      >
        <img :src="layer.previewUrl" class="h-[calc(40px+.5rem)] w-[calc(40px+.5rem)] p-2" />
        <span class="flex-grow px-4">
          {{ layer.name }}
        </span>
        <button
          class="mr-2 flex h-6 w-6 items-center justify-center rounded-sm border border-neutral-500 transition hover:bg-neutral-500"
          @click.stop="destroyLayer(layer)"
          v-if="layer.deleteable"
        >
          x
        </button>
      </div>
    </template>
  </div>
</template>
