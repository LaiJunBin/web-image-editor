interface DrawOptions {
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
  lineWidth: number
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
