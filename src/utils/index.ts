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
