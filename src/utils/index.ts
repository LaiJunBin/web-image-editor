export function getLayerObjectBoundingRect(imageData: ImageData) {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (
      !(
        imageData.data[i] === 0 &&
        imageData.data[i + 1] === 0 &&
        imageData.data[i + 2] === 0 &&
        imageData.data[i + 3] === 0
      )
    ) {
      const x = (i / 4) % imageData.width
      const y = Math.floor(i / 4 / imageData.width)
      left = Math.min(left, x)
      top = Math.min(top, y)
      right = Math.max(right, x)
      bottom = Math.max(bottom, y)
    }
  }

  const width = right - left + 1
  const height = bottom - top + 1

  return {
    left,
    top,
    width,
    height
  }
}

export function imageData2Base64(imageData: ImageData) {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

export function base64ToImageData(base64: string) {
  const img = new Image()
  img.src = base64
  return new Promise<ImageData>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      resolve(imageData)
    }
  })
}

export function cloneCanvas(canvas: HTMLCanvasElement) {
  const newCanvas = document.createElement('canvas')
  newCanvas.width = canvas.width
  newCanvas.height = canvas.height
  const ctx = newCanvas.getContext('2d')!
  ctx.drawImage(canvas, 0, 0)
  return newCanvas
}

export function getTransparentCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
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
  return { canvas, ctx }
}

export function functionToString(func: CallableFunction) {
  const name = func.name
  const string = func.toString()

  return {
    name,
    args: string.substring(string.indexOf('(') + 1, string.indexOf(')')),
    body: string.substring(string.indexOf('{') + 1, string.lastIndexOf('}'))
  }
}
