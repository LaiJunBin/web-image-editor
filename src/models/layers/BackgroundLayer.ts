import { Layer } from '../Layer'

export class BackgroundLayer extends Layer {
  public backgroundCanvas: HTMLCanvasElement = document.createElement('canvas')
  public backgroundCtx: CanvasRenderingContext2D = this.backgroundCanvas.getContext('2d', {
    willReadFrequently: true
  })!

  constructor(imageData?: ImageData) {
    super('背景', 0)
    this.reorderable = false
    this.deleteable = false

    if (imageData) {
      this.backgroundCanvas.width = imageData.width
      this.backgroundCanvas.height = imageData.height
      this.backgroundCtx.putImageData(imageData, 0, 0)
    }
  }

  getCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const { canvas, ctx } = super.getCanvas()
    ctx.drawImage(this.backgroundCanvas, 0, 0)
    return { canvas, ctx }
  }

  init() {
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(255, 255, 255, 255)'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.ctx.fillStyle = 'rgba(128, 128, 128, 255)'
    for (let i = 0; i < this.ctx.canvas.width; i += 10) {
      for (let j = 0; j < this.ctx.canvas.height; j += 10) {
        if ((i + j) % 20 === 0) {
          this.ctx.fillRect(i, j, 10, 10)
        }
      }
    }
    this.ctx.restore()
    this.ctx.drawImage(this.backgroundCanvas, 0, 0)
    this.save()
  }
}
