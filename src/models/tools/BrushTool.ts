import TheBrushTool from '@/components/tools/TheBrushTool.vue'
import { Tool } from '@/models/Tool'
import type { Component } from 'vue'
import type { Control } from '../Control'
import PaletteControl from '../controls/PaletteControl'
import { useLayerStore } from '@/stores/layer'
import LineWidthControl from '../controls/LineWidthControl'
import { draw } from '@/utils/tool'
import { useSettingStore } from '@/stores/setting'

class BrushTool extends Tool {
  drawing: boolean
  x: number
  y: number

  constructor(component: Component, controls: Control[] = []) {
    super('筆刷工具', component, controls)
    this.drawing = false
    this.x = 0
    this.y = 0
  }

  private draw(startX: number, startY: number, endX: number, endY: number) {
    const { color, lineWidth } = useSettingStore()
    const { recordLayer } = useLayerStore()
    if (!recordLayer) return
    const { ctx } = recordLayer

    draw(ctx, {
      startX,
      startY,
      endX,
      endY,
      color,
      lineWidth
    })
  }

  mouseover(e: MouseEvent) {
    this.x = e.offsetX
    this.y = e.offsetY
  }

  mousedown(e: MouseEvent) {
    this.drawing = true
    this.x = e.offsetX
    this.y = e.offsetY
  }

  mousemove(e: MouseEvent) {
    const { recordLayer } = useLayerStore()
    if (this.drawing) {
      this.draw(this.x, this.y, e.offsetX, e.offsetY)
      recordLayer?.save()
    }

    this.mousePreview(e)
    this.x = e.offsetX
    this.y = e.offsetY
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
    this.draw(this.x, this.y, e.offsetX, e.offsetY)
  }
}

export default new BrushTool(TheBrushTool, [PaletteControl, LineWidthControl])
