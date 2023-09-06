import { getLayerObjectBoundingRect } from '@/utils'

export class LayerObject {
  public imageData: ImageData

  public x: number
  public y: number
  public width: number
  public height: number
  public angle: number = 0

  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D

  public invalid: boolean = false

  constructor(imageData: ImageData, x: number, y: number, width: number, height: number) {
    this.imageData = imageData

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = imageData.width
    tmpCanvas.height = imageData.height
    const tmpCtx = tmpCanvas.getContext('2d')!
    tmpCtx.putImageData(imageData, 0, 0)

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')!
    this.ctx.drawImage(
      tmpCanvas,
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    )
  }

  update() {
    const canvas = document.createElement('canvas')
    canvas.width = this.imageData.width
    canvas.height = this.imageData.height
    const ctx = canvas.getContext('2d')!
    ctx.save()
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
    ctx.rotate(this.angle)
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
    ctx.drawImage(
      this.canvas,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
    ctx.restore()

    this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const { left, top, width, height } = getLayerObjectBoundingRect(this.imageData)
    if (!isFinite(left) || !isFinite(top) || !isFinite(width) || !isFinite(height)) {
      this.invalid = true
      return
    }

    this.x = left
    this.y = top
    this.width = width
    this.height = height

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(
      canvas,
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    )

    this.angle = 0
  }
}
