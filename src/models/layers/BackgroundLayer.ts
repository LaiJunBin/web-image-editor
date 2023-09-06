import { Layer } from '../Layer'

export class BackgroundLayer extends Layer {
  public backgroundImageData: ImageData
  constructor(imageData: ImageData) {
    super('背景', 0)
    this.backgroundImageData = imageData
    this.reorderable = false
    this.deleteable = false
  }

  init() {
    this.ctx.putImageData(this.backgroundImageData, 0, 0)
    this.save()
  }
}
