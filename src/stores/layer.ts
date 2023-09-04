import { Layer } from '@/models/Layer'
import { BackgroundLayer } from '@/models/layers/BackgroundLayer'
import { RecordLayer } from '@/models/layers/RecordLayer'
import { defineStore } from 'pinia'
import { computed, reactive, ref, type Ref } from 'vue'

export const useLayerStore = defineStore('layer', () => {
  const counter = ref(0)
  const backgroundLayer = ref<BackgroundLayer>() as Ref<BackgroundLayer>
  const recordLayer = ref<RecordLayer>()
  const layers = reactive<Layer[]>([]) as Layer[]
  const currentLayer = ref<Layer>()
  const sortedLayers = computed(() => {
    return layers.sort((a, b) => a.order - b.order)
  })

  const initLayers = (color: string) => {
    recordLayer.value = new RecordLayer()
    backgroundLayer.value = new BackgroundLayer(color)
    layers.length = 0
    layers.push(recordLayer.value, backgroundLayer.value)
    selectedLayer(backgroundLayer.value)
  }

  const addLayer = () => {
    const layer = new Layer(`圖層 ${++counter.value}`, layers.length)
    layers.push(layer)
    currentLayer.value = layer
  }

  const destroyLayer = (layer: Layer) => {
    const index = layers.indexOf(layer)
    if (index > -1) {
      layers.splice(index, 1)
    }
  }

  const selectedLayer = (layer: Layer) => {
    currentLayer.value = layer
  }
  return {
    layers,
    sortedLayers,
    currentLayer,
    backgroundLayer,
    recordLayer,
    initLayers,
    addLayer,
    destroyLayer,
    selectedLayer
  }
})
