onmessage = (e) => {
  const { objectsImageData, args } = e.data
  const callback = new Function(e.data.callback.args, e.data.callback.body)
  const newObjectsImageData: ImageData[] = []
  objectsImageData.forEach((imageData: ImageData) => {
    newObjectsImageData.push(callback(imageData, ...args))
  })
  postMessage({ newObjectsImageData })
}
