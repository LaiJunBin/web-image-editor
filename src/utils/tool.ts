interface DrawOptions {
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
  lineWidth: number
}

interface DrawImageOptions {
  x: number
  y: number
  size: number
  image: HTMLCanvasElement | HTMLImageElement
}

export function draw(ctx: CanvasRenderingContext2D, options: DrawOptions) {
  const { startX, startY, endX, endY, color, lineWidth } = options

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.closePath()
}

export function drawImage(ctx: CanvasRenderingContext2D, options: DrawImageOptions) {
  const { x, y, size, image } = options
  const scale = size / Math.min(image.width, image.height)

  ctx.drawImage(
    image,
    x - (image.width * scale) / 2,
    y - (image.height * scale) / 2,
    image.width * scale,
    image.height * scale
  )
}
