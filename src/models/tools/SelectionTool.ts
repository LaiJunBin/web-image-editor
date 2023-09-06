import TheSelectionTool from '@/components/tools/TheSelectionTool.vue'
import { Tool } from '@/models/Tool'
import type { Component } from 'vue'
import type { Control } from '../Control'
import { useLayerStore } from '@/stores/layer'
import SelectionControl from '../controls/SelectionControl'

class SelectionTool extends Tool {
  drawing: boolean
  startX: number
  startY: number
  width: number
  height: number

  constructor(component: Component, controls: Control[] = []) {
    super('範圍選取工具', component, controls)
    this.autoCommit = false
    this.drawing = false
    this.startX = 0
    this.startY = 0
    this.width = 0
    this.height = 0
  }

  clear() {
    const { recordLayer } = useLayerStore()
    if (!recordLayer) return
    const { ctx } = recordLayer
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  mouseover(e: MouseEvent) {}

  mousedown(e: MouseEvent) {
    this.clear()
    this.drawing = true
    this.startX = e.offsetX
    this.startY = e.offsetY
  }

  mousemove(e: MouseEvent) {
    const { recordLayer } = useLayerStore()
    if (!recordLayer || !this.drawing) return
    const { ctx } = recordLayer

    const { left, top } = recordLayer!.ctx.canvas.getBoundingClientRect()

    const { clientX, clientY } = e
    const offsetX = clientX - left
    const offsetY = clientY - top

    this.width = Math.max(
      Math.min(offsetX - this.startX, ctx.canvas.width - this.startX),
      -this.startX
    )
    this.height = Math.max(
      Math.min(offsetY - this.startY, ctx.canvas.height - this.startY),
      -this.startY
    )

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'
    ctx.setLineDash([5, 5])
    ctx.strokeRect(this.startX, this.startY, this.width, this.height)
    ctx.restore()
  }

  mouseup(e: MouseEvent) {
    this.drawing = false
  }

  copyToLayer() {
    const { currentLayer, recordLayer, addLayer } = useLayerStore()
    if (
      !currentLayer ||
      !recordLayer ||
      !this.startX ||
      !this.startY ||
      !this.width ||
      !this.height
    )
      return
    recordLayer.ctx.clearRect(0, 0, recordLayer.ctx.canvas.width, recordLayer.ctx.canvas.height)

    const x = Math.min(this.startX, this.startX + this.width)
    const y = Math.min(this.startY, this.startY + this.height)
    const width = Math.abs(this.width)
    const height = Math.abs(this.height)

    const imageData = currentLayer.ctx.getImageData(x, y, width, height)
    if (imageData.data.every((v) => v === 0)) return

    const canvas = document.createElement('canvas')
    canvas.width = recordLayer.ctx.canvas.width
    canvas.height = recordLayer.ctx.canvas.height
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(imageData, x, y)

    addLayer(ctx.getImageData(0, 0, canvas.width, canvas.height))

    this.startX = 0
    this.startY = 0
    this.width = 0
    this.height = 0
  }

  mouseout(e: MouseEvent) {}

  mousePreview(e: MouseEvent) {}
}

export default new SelectionTool(TheSelectionTool, [SelectionControl])
