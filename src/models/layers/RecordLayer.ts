import { markRaw } from 'vue'
import { Layer } from '../Layer'
import { useLayerStore } from '@/stores/layer'
import TheRecordLayer from '@/components/canvas/TheRecordLayer.vue'

export class RecordLayer extends Layer {
  constructor() {
    super('紀錄', Number.MAX_SAFE_INTEGER)
    this.component = markRaw(TheRecordLayer)
    this.visible = false
  }

  commit() {
    const { currentLayer } = useLayerStore()
    if (!this.ctx || !currentLayer) return
    const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    if (imageData.data.every((value) => value === 0)) return
    currentLayer.objects.push(imageData)
    currentLayer.render()
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.save()
  }
}
