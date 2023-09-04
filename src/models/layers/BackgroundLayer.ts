import { Layer } from '../Layer'

export class BackgroundLayer extends Layer {
  public color: string
  constructor(color: string) {
    super('背景', 0)
    this.color = color
    this.reorderable = false
    this.deleteable = false
  }

  init() {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.save()
  }
}
