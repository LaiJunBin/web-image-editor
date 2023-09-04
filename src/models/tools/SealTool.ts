import { Tool } from '@/models/Tool'
import type { Component } from 'vue'
import type { Control } from '../Control'
import TheSealTool from '@/components/tools/TheSealTool.vue'
import { useSealStore } from '@/stores/seal'
import { drawImage } from '@/utils/tool'
import { useLayerStore } from '@/stores/layer'
import SealControl from '../controls/SealControl'

class SealTool extends Tool {
  drawing: boolean

  constructor(component: Component, controls: Control[] = []) {
    super('樣章工具', component, controls)
    this.drawing = false
  }

  private draw(x: number, y: number) {
    const { currentSeal } = useSealStore()
    const { recordLayer } = useLayerStore()
    if (!currentSeal || !recordLayer?.ctx) return
    drawImage(recordLayer.ctx, { x, y, image: currentSeal.canvas, size: currentSeal.size })
  }

  mouseover(e: MouseEvent) {}

  mousedown(e: MouseEvent) {
    this.drawing = true
  }

  mousemove(e: MouseEvent) {
    const { recordLayer } = useLayerStore()
    if (this.drawing) {
      this.draw(e.offsetX, e.offsetY)
      recordLayer?.save()
    }

    this.mousePreview(e)
  }

  mouseup(e: MouseEvent) {
    this.drawing = false
  }

  mouseout(e: MouseEvent) {
    const { recordLayer } = useLayerStore()
    recordLayer?.restore()
  }

  mousePreview(e: MouseEvent) {
    const { recordLayer } = useLayerStore()
    if (!recordLayer) return
    recordLayer.restore()
    this.draw(e.offsetX, e.offsetY)
  }
}

export default new SealTool(TheSealTool, [SealControl])
