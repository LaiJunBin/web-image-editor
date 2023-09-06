import { Layer } from '@/models/Layer'
import { BackgroundLayer } from '@/models/layers/BackgroundLayer'
import { RecordLayer } from '@/models/layers/RecordLayer'
import { defineStore } from 'pinia'
import { computed, reactive, ref, type Ref } from 'vue'
import { useHistoryStore } from './history'
import { useBlockStore } from './block'

export const useLayerStore = defineStore('layer', () => {
  const { commitHistory, clearHistory } = useHistoryStore()
  const { setBlock } = useBlockStore()

  const counter = ref(0)
  const backgroundLayer = ref<BackgroundLayer>() as Ref<BackgroundLayer>
  const recordLayer = ref<RecordLayer>()
  const layers = reactive<Layer[]>([]) as Layer[]
  const currentLayer = ref<Layer>()
  const sortedLayers = computed(() => {
    return [...layers].sort((a, b) => a.order - b.order)
  })

  const initLayers = (color: string) => {
    recordLayer.value = new RecordLayer()
    backgroundLayer.value = new BackgroundLayer(color)
    layers.length = 0
    layers.push(recordLayer.value, backgroundLayer.value)
    selectedLayer(backgroundLayer.value)
    clearHistory()
  }

  const addLayer = (imageData?: ImageData) => {
    const layer = new Layer(`圖層 ${++counter.value}`, layers.length, imageData)

    const originalCounter = counter.value
    commitHistory(
      () => {
        layers.push(layer)
        selectedLayer(layer)
        counter.value = originalCounter
      },
      () => {
        const index = layers.indexOf(layer)
        if (index > -1) {
          layers.splice(index, 1)
        }
        selectedLayer(layers[layers.length - 1])
        counter.value--
      }
    )
  }

  const destroyLayer = (layer: Layer) => {
    const isCurrentLayer = layer === currentLayer.value

    commitHistory(
      () => {
        const index = layers.indexOf(layer)
        if (index > -1) {
          layers.splice(index, 1)
        }
        currentLayer.value = layers[layers.length - 1]
        if (isCurrentLayer) {
          setBlock(null)
        }
      },
      () => {
        layers.push(layer)
        currentLayer.value = layer
      }
    )
  }

  const selectedLayer = (layer: Layer) => {
    setBlock(null)
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
