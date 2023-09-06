import { markRaw, type Component } from 'vue'
import TheLayer from '@/components/canvas/TheLayer.vue'
import { LayerObject } from './LayerObject'
import { getLayerObjectBoundingRect } from '@/utils'

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

  private updatePreviewUrl() {
    const canvas = document.createElement('canvas')
    canvas.width = 40
    canvas.height = 40
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'rgba(255, 255, 255, 255)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(128, 128, 128, 255)'
    for (let i = 0; i < canvas.width; i += 5) {
      for (let j = 0; j < canvas.height; j += 5) {
        if ((i + j) % 10 === 0) {
          ctx.fillRect(i, j, 5, 5)
        }
      }
    }

    ctx.drawImage(
      this.ctx.canvas,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    )
    this.previewUrl = canvas.toDataURL()
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

  render() {
    if (!this.ctx) return
    this.init()

    this.objects.forEach((object) => {
      const { canvas, x, y, width, height, angle } = object
      this.ctx.save()
      this.ctx.translate(x + width / 2, y + height / 2)
      this.ctx.rotate(angle)
      this.ctx.translate(-(x + width / 2), -(y + height / 2))
      this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, y, width, height)
      this.ctx.restore()
    })
    this.save()
  }
}
