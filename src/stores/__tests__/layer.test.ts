import { toRaw, toRefs } from 'vue'
import { useLayerStore } from '../layer'
import { Layer } from '@/models/Layer'
import { BackgroundLayer } from '@/models/layers/BackgroundLayer'
import { RecordLayer } from '@/models/layers/RecordLayer'
import { useHistoryStore } from '../history'
import { useSettingStore } from '../setting'
import type { fn } from '@/test-utils'

const mockCommitHistory = vi.fn()
vi.mock('@/stores/history', async () => {
  const { useHistoryStore } = await vi.importActual<typeof import('@/stores/history')>(
    '@/stores/history'
  )

  return {
    useHistoryStore: () => ({
      ...useHistoryStore(),
      commitHistory: mockCommitHistory.mockImplementation((fn, rollback) => {
        const { commitHistory } = useHistoryStore()
        commitHistory(fn, rollback)
      })
    })
  }
})

describe('layer store', () => {
  beforeEach(() => {
    mockCommitHistory.mockClear()
    const { initSettings } = useSettingStore()
    initSettings(100, 100)
  })

  describe('initLayers', () => {
    it('should contain background layer and record layer', () => {
      const { layers, initLayersFromColor } = toRefs(useLayerStore())
      initLayersFromColor.value('#333')
      expect(layers.value.length).toBe(2)
      expect(
        layers.value.filter(
          (layer) => layer instanceof BackgroundLayer || layer instanceof RecordLayer
        ).length
      ).toBe(2)
    })

    it('should set correct background color', () => {
      const { initLayersFromColor, backgroundLayer } = toRefs(useLayerStore())

      const tmpImageData = new ImageData(2, 2)
      tmpImageData.data.set([0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255])

      const cvs = document.createElement('canvas')
      const ctx = cvs.getContext('2d')!
      const getContext = vi.fn(() => ({
        ...ctx,
        getImageData: vi.fn(() => tmpImageData)
      }))
      vi.spyOn(document, 'createElement').mockReturnValueOnce({ getContext } as any)

      const color1 = '#333333'
      initLayersFromColor.value(color1)
      const backgroundCtx = backgroundLayer.value.backgroundCanvas.getContext('2d')!
      const putImageData = backgroundCtx.putImageData as fn

      expect(getContext.mock.results[0].value.fillStyle).toBe(color1)
      expect(putImageData.mock.calls).toHaveLength(1)
      expect(putImageData.mock.calls[0][0]).toBe(tmpImageData)
    })

    it('should select background layer', () => {
      const { currentLayer, initLayersFromColor } = toRefs(useLayerStore())
      initLayersFromColor.value('#333')
      expect(toRaw(currentLayer.value)).toBeInstanceOf(BackgroundLayer)
    })
  })

  describe('addLayer', () => {
    it('should add a new layer and select it', () => {
      const { layers, currentLayer, initLayersFromColor, addLayer } = toRefs(useLayerStore())
      initLayersFromColor.value('#333')
      addLayer.value()

      expect(layers.value.length).toBe(3)
      expect(currentLayer.value).toBe(layers.value[2])
    })

    it('should commit history', () => {
      const { addLayer } = toRefs(useLayerStore())
      addLayer.value()
      expect(mockCommitHistory).toHaveBeenCalled()
    })

    it('should can undo and redo', () => {
      const { undo, redo } = useHistoryStore()
      const { initLayersFromColor, layers, addLayer } = toRefs(useLayerStore())

      initLayersFromColor.value('#333')
      expect(layers.value.length).toBe(2)
      addLayer.value()
      const layer = layers.value[2]
      expect(layers.value.length).toBe(3)
      undo()
      expect(layers.value.length).toBe(2)
      expect(layers.value.find((l) => l === layer)).toBeUndefined()
      redo()
      expect(layers.value.length).toBe(3)
      expect(layers.value.find((l) => l === layer)).not.toBeUndefined()
    })
  })

  describe('destroyLayer', () => {
    it('should destroy correct layer and commit history', () => {
      const { layers, initLayersFromColor, addLayer, destroyLayer } = toRefs(useLayerStore())
      initLayersFromColor.value('#333')
      addLayer.value()
      addLayer.value()
      addLayer.value()
      expect(layers.value.length).toBe(5)
      const layer = layers.value[3]
      expect(layers.value.find((l) => l === layer)).not.toBeUndefined()

      mockCommitHistory.mockClear()
      destroyLayer.value(layer as Layer)
      expect(layers.value.length).toBe(4)
      expect(layers.value.find((l) => l === layer)).toBeUndefined()
      expect(mockCommitHistory).toHaveBeenCalled()
    })

    it('should can undo and redo', () => {
      const { layers, initLayersFromColor, addLayer, destroyLayer } = toRefs(useLayerStore())
      const { undo, redo } = useHistoryStore()

      initLayersFromColor.value('#333')
      addLayer.value()
      addLayer.value()
      addLayer.value()
      expect(layers.value.length).toBe(5)
      const layer = layers.value[3]
      expect(layers.value.find((l) => l === layer)).not.toBeUndefined()

      destroyLayer.value(layer as Layer)
      expect(layers.value.length).toBe(4)
      expect(layers.value.find((l) => l === layer)).toBeUndefined()

      undo()
      expect(layers.value.length).toBe(5)
      expect(layers.value.find((l) => l === layer)).not.toBeUndefined()

      redo()
      expect(layers.value.length).toBe(4)
      expect(layers.value.find((l) => l === layer)).toBeUndefined()
    })
  })

  describe('selectedLayer', () => {
    it('should select correct layer', () => {
      const { layers, currentLayer, initLayersFromColor, addLayer, selectedLayer } = toRefs(
        useLayerStore()
      )
      initLayersFromColor.value('#333')
      expect(toRaw(currentLayer.value)).toBeInstanceOf(BackgroundLayer)
      addLayer.value()
      selectedLayer.value(layers.value[2] as Layer)
      expect(currentLayer.value).toBe(layers.value[2])
    })
  })

  describe('sortedLayers', () => {
    it('should sort layers by order', () => {
      const { layers, initLayersFromColor, addLayer, sortedLayers } = toRefs(useLayerStore())
      initLayersFromColor.value('#333')
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
