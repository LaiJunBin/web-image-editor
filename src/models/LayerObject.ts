import { getLayerObjectBoundingRect } from '@/utils'

export class LayerObject {
  public imageData: ImageData

  public x: number
  public y: number
  public offsetX: number
  public offsetY: number
  public width: number
  public height: number
  public angle: number = 0

  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D

  constructor(
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    this.imageData = imageData

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.offsetX = offsetX
    this.offsetY = offsetY

    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = imageData.width
    tmpCanvas.height = imageData.height
    const tmpCtx = tmpCanvas.getContext('2d')!
    tmpCtx.putImageData(imageData, 0, 0)

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!
    this.ctx.drawImage(
      tmpCanvas,
      this.x + this.offsetX,
      this.y + this.offsetY,
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

    const drawX = Math.max(Math.min(this.x, canvas.width - this.canvas.width), 0)
    const drawY = Math.max(Math.min(this.y, canvas.height - this.canvas.height), 0)
    this.offsetX = drawX - this.x
    this.offsetY = drawY - this.y

    ctx.save()
    ctx.translate(drawX + this.width / 2, drawY + this.height / 2)
    ctx.rotate(this.angle)
    ctx.translate(-(drawX + this.width / 2), -(drawY + this.height / 2))
    ctx.drawImage(
      this.canvas,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      drawX,
      drawY,
      this.width,
      this.height
    )
    ctx.restore()

    this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const { left, top, width, height } = getLayerObjectBoundingRect(this.imageData)

    this.x = left - this.offsetX
    this.y = top - this.offsetY
    this.width = width
    this.height = height

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(canvas, left, top, width, height, 0, 0, this.width, this.height)

    this.angle = 0
  }
}
