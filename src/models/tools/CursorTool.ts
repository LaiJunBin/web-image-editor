import { Tool } from '@/models/Tool'
import { ref, type Component, toRefs } from 'vue'
import type { Control } from '../Control'
import TheCursorTool from '@/components/tools/TheCursorTool.vue'
import { useLayerStore } from '@/stores/layer'
import { useBlockStore } from '@/stores/block'
import CursorControl from '../controls/CursorControl'
import { LayerObject } from '../LayerObject'
import { useHistoryStore } from '@/stores/history'
import { cloneCanvas } from '@/utils'
import { useSettingStore } from '@/stores/setting'

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

    setBlock(object)
    this.moving = true
  }

  private move(e: MouseEvent) {
    const { block, setBlock } = useBlockStore()
    const { currentLayer } = useLayerStore()
    const { settings } = useSettingStore()
    const { movementX, movementY } = e
    if (!block) return

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

    const { x, y } = block
    const scale = settings.scale / 100

    this.commitFn = () => {
      block.x = x + movementX / scale
      block.y = y + movementY / scale
      currentLayer!.render()
      setBlock(block.object)
    }

    this.commitFn()
  }

  private resize(e: MouseEvent) {
    const { block, setBlock } = useBlockStore()
    const { currentLayer } = useLayerStore()
    const { movementX, movementY } = e
    const { settings } = useSettingStore()
    if (!block) return

    const scale = settings.scale / 100
    const values = [
      [1, 1, 1, 1, 0, 0],
      [0, 1, -1, 1, -1, 0],
      [0, 0, -1, -1, -1, -1],
      [1, 0, 1, -1, 0, -1]
    ][this.resizing - 1]

    const newWidth = block.width - (movementX / scale) * values[2]
    const newHeight = block.height - (movementY / scale) * values[3]
    const newX = block.x + (movementX / scale) * values[0]
    const newY = block.y + (movementY / scale) * values[1]

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
    const { block, setBlock, tempBlock, setTempBlock } = useBlockStore()
    const { settings } = useSettingStore()
    if (!block) return

    const scale = settings.scale / 100
    const { left, top } = recordLayer!.boundingRect

    const { clientX, clientY } = e

    const { x, y, width, height } = block
    const centerX = left + x * scale + (width * scale) / 2
    const centerY = top + y * scale + (height * scale) / 2

    const angle = Math.atan2(clientY - centerY, clientX - centerX)

    if (this.startAngle === null) {
      setTempBlock(block.object)
      this.startAngle = angle - block.object.angle
    }
    const newAngle = angle - this.startAngle

    this.commitFn = () => {
      setBlock(block!.object)
      block!.angle = newAngle
      currentLayer!.render()
      setBlock(block!.object)
    }

    this.rollbackFn = () => {
      block.x = tempBlock!.x
      block.y = tempBlock!.y
      block.width = tempBlock!.width
      block.height = tempBlock!.height
      setBlock(block!.object)
      block!.angle = -newAngle
      currentLayer!.render()
      setBlock(block!.object)
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

    const originalCommitFn = this.commitFn
    const originalRollbackFn = this.rollbackFn

    const beforeCtx = ref<CanvasRenderingContext2D | null>(null)
    const deletedLayerObject = ref<LayerObject | null>(null)
    const { currentLayer } = useLayerStore()
    const { block } = useBlockStore()
    const { x, y, width, height, imageData } = block!.object
    const { width: maxWidth, height: maxHeight } = imageData
    if (x <= -width || y <= -height || x >= maxWidth || y >= maxHeight) {
      deletedLayerObject.value = block!.object
    }
    const deletedLayerObjectIndex = currentLayer!.objects.findIndex(
      (object) => object === deletedLayerObject.value
    )

    this.commitFn = () => {
      originalCommitFn()
      const { currentLayer } = useLayerStore()
      const { block, setBlock } = toRefs(useBlockStore())
      const canvas = cloneCanvas(block.value?.object.canvas!)
      const ctx = canvas.getContext('2d')!
      beforeCtx.value = ctx

      block.value?.object.update()

      if (deletedLayerObject.value) {
        currentLayer!.objects.splice(deletedLayerObjectIndex, 1)
        setBlock.value(null)
      } else {
        setBlock.value(block.value!.object)
      }

      currentLayer!.render()
    }

    this.rollbackFn = () => {
      originalRollbackFn()
      const { currentLayer } = useLayerStore()
      const { block, setBlock } = useBlockStore()

      if (deletedLayerObject.value) {
        currentLayer!.objects.splice(deletedLayerObjectIndex, 0, deletedLayerObject.value)
      }

      block?.object.update()
      block!.x = block?.x!
      block!.y = block?.y!
      block!.width = block?.width!
      block!.height = block?.height!
      block!.object.canvas = beforeCtx.value?.canvas!
      block!.object.ctx = beforeCtx.value!
      currentLayer!.render()

      setBlock(block!.object)
    }

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
