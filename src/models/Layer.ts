import { markRaw, type Component } from 'vue'
import TheLayer from '@/components/canvas/TheLayer.vue'
import { LayerObject } from './LayerObject'
import { getLayerObjectBoundingRect, getTransparentCanvas } from '@/utils'

export class Layer {
  private _ref: HTMLCanvasElement | null

  public name: string
  public order: number
  public component: Component
  public ctx: CanvasRenderingContext2D
  public previewUrl: string
  public imageData: ImageData | null
  public objects: LayerObject[]
  public visible: boolean
  public reorderable: boolean
  public deleteable: boolean

  private initImageData: ImageData | null = null

  constructor(name: string, order: number, initImageData: ImageData | null = null) {
    this.name = name
    this.order = order
    this.component = markRaw(TheLayer)

    this._ref = null
    this.ctx = null as unknown as CanvasRenderingContext2D
    this.previewUrl = ''
    this.imageData = null
    this.objects = []
    this.visible = true
    this.reorderable = true
    this.deleteable = true

    this.initImageData = initImageData
  }

  get ref(): HTMLCanvasElement | null {
    return this._ref
  }

  set ref(ref: HTMLCanvasElement | null) {
    this._ref = ref
    if (this._ref) {
      this.ctx = this._ref.getContext('2d', { willReadFrequently: true })!
      if (this.initImageData) {
        if (this.objects.length > 0) return
        const { top, left, width, height } = getLayerObjectBoundingRect(this.initImageData)
        const object = new LayerObject(this.initImageData, left, top, width, height)
        this.objects.push(object)
      }
    }
  }

  updatePreviewUrl() {
    const { canvas: objectCanvas } = this.getRenderedObjectCanvas()
    const { canvas: previewCanvas, ctx: previewCtx } = getTransparentCanvas(40, 40)
    previewCtx.drawImage(
      objectCanvas,
      0,
      0,
      objectCanvas.width,
      objectCanvas.height,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height
    )
    this.previewUrl = previewCanvas.toDataURL()
  }

  init() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.save()
  }

  save() {
    if (!this.ctx) return
    this.imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.updatePreviewUrl()
  }

  restore() {
    if (!this.ctx || !this.imageData) return
    this.ctx.putImageData(this.imageData, 0, 0)
    this.updatePreviewUrl()
  }

  getCanvas() {
    const canvas = document.createElement('canvas')
    canvas.width = this.ctx.canvas.width
    canvas.height = this.ctx.canvas.height
    const ctx = canvas.getContext('2d')!
    return { canvas, ctx }
  }

  getRenderedObjectCanvas() {
    const { canvas, ctx } = this.getCanvas()

    this.objects.forEach((object) => {
      const { canvas, x, y, width, height, angle } = object

      ctx.save()
      ctx.translate(x + width / 2, y + height / 2)
      ctx.rotate(angle)
      ctx.translate(-(x + width / 2), -(y + height / 2))
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, y, width, height)
      ctx.restore()
    })
    return { canvas, ctx }
  }

  render() {
    if (!this.ctx) return
    const { canvas } = this.getRenderedObjectCanvas()

    this.init()
    this.ctx.drawImage(canvas, 0, 0)
    this.save()
  }
}
