import { Tool } from '@/models/Tool'
import { type Component } from 'vue'
import type { Control } from '../Control'
import TheCursorTool from '@/components/tools/TheCursorTool.vue'
import { useLayerStore } from '@/stores/layer'
import { useBlockStore } from '@/stores/block'
import CursorControl from '../controls/CursorControl'
import type { LayerObject } from '../LayerObject'
import { useHistoryStore } from '@/stores/history'

export class CursorTool extends Tool {
  resizing: number
  rotating: boolean
  moving: boolean

  private startAngle: number | null
  private commitFn: (() => void) | null
  private rollbackFn: (() => void) | null

  constructor(component: Component, controls: Control[] = []) {
    super('選取工具', component, controls)
    this.resizing = 0
    this.rotating = false
    this.moving = false

    this.startAngle = null
    this.commitFn = null
    this.rollbackFn = null
  }

  resetStatus() {
    this.resizing = 0
    this.rotating = false
    this.moving = false
  }

  mouseover(e: MouseEvent) {}

  mousedown(e: MouseEvent) {
    const { currentLayer } = useLayerStore()
    const { setBlock } = useBlockStore()
    if (!currentLayer) return
    const { objects } = currentLayer

    const { offsetX, offsetY } = e
    const object = objects.find((object) => {
      const cvs = document.createElement('canvas')
      cvs.width = currentLayer.ctx.canvas.width
      cvs.height = currentLayer.ctx.canvas.height
      const ctx = cvs.getContext('2d')!
      const { canvas, x, y, width, height } = object
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, y, width, height)
      const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height)
      const index = (offsetY * imageData.width + offsetX) * 4
      const [r, g, b, a] = imageData.data.slice(index, index + 4)
      return r !== 0 || g !== 0 || b !== 0 || a !== 0
    })

    if (!object) {
      setBlock(null)
      return
    }

    setBlock(object as LayerObject)
    this.moving = true
  }

  private move(e: MouseEvent) {
    const { block, setBlock } = useBlockStore()
    const { currentLayer } = useLayerStore()
    const { movementX, movementY } = e
    if (!block) return

    if (!this.rollbackFn) {
      const { x, y } = block
      this.rollbackFn = () => {
        block.x = x
        block.y = y
        currentLayer!.render()
        setBlock(block.object)
      }
    }

    const { x, y } = block
    this.commitFn = () => {
      block.x = x + movementX
      block.y = y + movementY
      currentLayer!.render()
      setBlock(block.object)
    }

    this.commitFn()
  }

  private resize(e: MouseEvent) {
    const { block, setBlock } = useBlockStore()
    const { currentLayer } = useLayerStore()
    const { movementX, movementY } = e
    if (!block) return

    const values = [
      [1, 1, 1, 1, 0, 0],
      [0, 1, -1, 1, -1, 0],
      [0, 0, -1, -1, -1, -1],
      [1, 0, 1, -1, 0, -1]
    ][this.resizing - 1]

    const newWidth = block.width - movementX * values[2]
    const newHeight = block.height - movementY * values[3]
    const newX = block.x + movementX * values[0]
    const newY = block.y + movementY * values[1]

    if (
      (block.width > newWidth && newWidth <= 10) ||
      (block.height > newHeight && newHeight <= 10)
    ) {
      return
    }
    if (!this.rollbackFn) {
      const { x, y, width, height } = block
      this.rollbackFn = () => {
        block.x = x
        block.y = y
        block.width = width
        block.height = height
        currentLayer!.render()
        setBlock(block.object)
      }
    }

    this.commitFn = () => {
      block.width = newWidth
      block.height = newHeight
      block.x = newX
      block.y = newY
      currentLayer!.render()
      setBlock(block.object)
    }

    this.commitFn()
  }

  private rotate(e: MouseEvent) {
    const { currentLayer, recordLayer } = useLayerStore()
    const { block, setBlock } = useBlockStore()
    if (!block) return

    const { left, top } = recordLayer!.ctx.canvas.getBoundingClientRect()

    const { clientX, clientY } = e
    const offsetX = clientX - left
    const offsetY = clientY - top

    const { x, y, width, height } = block
    const centerX = x + width / 2
    const centerY = y + height / 2
    const angle = Math.atan2(offsetY - centerY, offsetX - centerX)

    if (this.startAngle === null) {
      this.startAngle = angle - block.angle
    }
    const newAngle = angle - this.startAngle

    if (!this.rollbackFn) {
      const { angle } = block
      this.rollbackFn = () => {
        if (block.object.angle) {
          block.angle = angle
        } else {
          block.angle = -newAngle
          block.object.update()
        }
        currentLayer!.render()
        setBlock(block.object)
      }
    }

    this.commitFn = () => {
      block.angle = newAngle
      currentLayer!.render()
      setBlock(block.object)
    }

    this.commitFn()
  }

  mousemove(e: MouseEvent) {
    switch (true) {
      case this.moving:
        this.move(e)
        break
      case this.resizing !== 0:
        this.resize(e)
        break
      case this.rotating:
        this.rotate(e)
        break
    }
  }

  mouseup(e: MouseEvent) {
    if (!this.moving && !this.resizing && !this.rotating) return
    this.resetStatus()

    if (!this.commitFn || !this.rollbackFn) return
    const { commitHistory } = useHistoryStore()
    commitHistory(this.commitFn, this.rollbackFn)

    this.startAngle = null
    this.commitFn = null
    this.rollbackFn = null
  }

  mouseout(e: MouseEvent) {}

  mousePreview(e: MouseEvent) {}
}

export default new CursorTool(TheCursorTool, [CursorControl])
