import { Layer } from '@/models/Layer'
import { BackgroundLayer } from '@/models/layers/BackgroundLayer'
import { RecordLayer } from '@/models/layers/RecordLayer'
import { defineStore } from 'pinia'
import { computed, reactive, ref, type Ref } from 'vue'
import { useHistoryStore } from './history'
import { useBlockStore } from './block'
import { useSettingStore } from './setting'

export const useLayerStore = defineStore('layer', () => {
  const { commitHistory, clearHistory } = useHistoryStore()
  const { setBlock } = useBlockStore()

  const offsetX = ref(0)
  const offsetY = ref(0)

  const counter = ref(0)
  const backgroundLayer = ref<BackgroundLayer>() as Ref<BackgroundLayer>
  const recordLayer = ref<RecordLayer>()
  const layers = reactive<Layer[]>([]) as Layer[]
  const currentLayer = ref<Layer>()
  const sortedLayers = computed(() => {
    return [...layers].sort((a, b) => a.order - b.order)
  })

  const setOffset = (x: number, y: number) => {
    offsetX.value = x
    offsetY.value = y
  }

  const initLayers = (imageData: ImageData) => {
    recordLayer.value = new RecordLayer()
    backgroundLayer.value = new BackgroundLayer(imageData)
    layers.length = 0
    layers.push(recordLayer.value, backgroundLayer.value)
    selectedLayer(backgroundLayer.value)
    clearHistory()
  }

  const initLayersFromColor = (color: string) => {
    const { settings } = useSettingStore()
    const canvas = document.createElement('canvas')
    canvas.width = settings.width
    canvas.height = settings.height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    initLayers(imageData)
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
    offsetX,
    offsetY,
    layers,
    sortedLayers,
    currentLayer,
    backgroundLayer,
    recordLayer,
    initLayers,
    initLayersFromColor,
    addLayer,
    destroyLayer,
    selectedLayer,
    setOffset
  }
})
