import { toRaw, toRefs } from 'vue'
import { useLayerStore } from '../layer'
import { Layer } from '@/models/Layer'
import { BackgroundLayer } from '@/models/layers/BackgroundLayer'
import { RecordLayer } from '@/models/layers/RecordLayer'

describe('layer store', () => {
  describe('initLayers', () => {
    it('should contain background layer and record layer', () => {
      const { layers, initLayers } = toRefs(useLayerStore())
      initLayers.value('#333')
      expect(layers.value.length).toBe(2)
      expect(
        layers.value.filter(
          (layer) => layer instanceof BackgroundLayer || layer instanceof RecordLayer
        ).length
      ).toBe(2)
    })

    it('should set correct background color', () => {
      const { backgroundLayer, initLayers } = toRefs(useLayerStore())
      const color1 = '#333'
      initLayers.value(color1)
      expect(toRaw(backgroundLayer.value.color)).toBe(color1)
      const color2 = '#666'
      initLayers.value(color2)
      expect(toRaw(backgroundLayer.value.color)).toBe(color2)
    })

    it('should select background layer', () => {
      const { currentLayer, initLayers } = toRefs(useLayerStore())
      initLayers.value('#333')
      expect(toRaw(currentLayer.value)).toBeInstanceOf(BackgroundLayer)
    })
  })

  describe('addLayer', () => {
    it('should add a new layer and select it', () => {
      const { layers, currentLayer, initLayers, addLayer } = toRefs(useLayerStore())
      initLayers.value('#333')
      addLayer.value()

      expect(layers.value.length).toBe(3)
      expect(currentLayer.value).toBe(layers.value[2])
    })
  })

  describe('destroyLayer', () => {
    it('should destroy correct layer', () => {
      const { layers, initLayers, addLayer, destroyLayer } = toRefs(useLayerStore())
      initLayers.value('#333')
      addLayer.value()
      addLayer.value()
      addLayer.value()
      expect(layers.value.length).toBe(5)
      const layer = layers.value[3]
      expect(layers.value.find((l) => l === layer)).not.toBeUndefined()
      destroyLayer.value(layer as Layer)
      expect(layers.value.length).toBe(4)
      expect(layers.value.find((l) => l === layer)).toBeUndefined()
    })
  })

  describe('selectedLayer', () => {
    it('should select correct layer', () => {
      const { layers, currentLayer, initLayers, addLayer, selectedLayer } = toRefs(useLayerStore())
      initLayers.value('#333')
      expect(toRaw(currentLayer.value)).toBeInstanceOf(BackgroundLayer)
      addLayer.value()
      selectedLayer.value(layers.value[2] as Layer)
      expect(currentLayer.value).toBe(layers.value[2])
    })
  })

  describe('sortedLayers', () => {
    it('should sort layers by order', () => {
      const { layers, initLayers, addLayer, sortedLayers } = toRefs(useLayerStore())
      initLayers.value('#333')
      addLayer.value()
      addLayer.value()
      addLayer.value()
      layers.value[2].order = 3
      layers.value[3].order = 1
      layers.value[4].order = 2

      const orders = sortedLayers.value.map((layer) => layer.order)
      expect(orders).toStrictEqual([...orders].sort())
    })
  })
})
