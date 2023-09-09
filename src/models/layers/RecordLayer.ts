import { markRaw } from 'vue'
import { Layer } from '../Layer'
import { useLayerStore } from '@/stores/layer'
import TheRecordLayer from '@/components/canvas/TheRecordLayer.vue'
import { useHistoryStore } from '@/stores/history'
import { getLayerObjectBoundingRect } from '@/utils'
import { LayerObject } from '../LayerObject'
import { useBlockStore } from '@/stores/block'

export class RecordLayer extends Layer {
  boundingRect: DOMRect

  constructor() {
    super('紀錄', Number.MAX_SAFE_INTEGER)
    this.component = markRaw(TheRecordLayer)
    this.visible = false
    this.boundingRect = new DOMRect(0, 0, 0, 0)
  }

  updateBoundingRect() {
    const { canvas } = this.ctx
    this.boundingRect = canvas.getBoundingClientRect()
  }

  commit() {
    const { setBlock } = useBlockStore()
    const { commitHistory } = useHistoryStore()
    const { currentLayer, selectedLayer } = useLayerStore()
    if (!this.ctx || !currentLayer) return
    const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    if (imageData.data.every((value) => value === 0)) return
    const { top, left, width, height } = getLayerObjectBoundingRect(imageData)

    const object = new LayerObject(imageData, left, top, width, height)
    commitHistory(
      () => {
        currentLayer.objects.push(object)
        currentLayer.render()
        selectedLayer(currentLayer as Layer)
        setBlock(null)
      },
      () => {
        currentLayer.objects.pop()
        currentLayer.render()
        selectedLayer(currentLayer as Layer)
        setBlock(null)
      }
    )
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.save()
  }
}
