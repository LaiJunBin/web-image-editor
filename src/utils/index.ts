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
