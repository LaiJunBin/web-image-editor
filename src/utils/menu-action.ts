import NewProjectModalVue from '@/components/modals/NewProjectModal.vue'
import { useModalStore } from '@/stores/modal'
import { useHistoryStore } from '@/stores/history'
import { useSettingStore } from '@/stores/setting'
import { useLayerStore } from '@/stores/layer'
import { base64ToImageData, imageData2Base64 } from '.'
import { LayerObject } from '@/models/LayerObject'
import { toRefs } from 'vue'
import { Layer } from '@/models/Layer'
import { useSelectionStore } from '@/stores/selection'

export function newProject() {
  const { openModal } = useModalStore()
  openModal(NewProjectModalVue)
}

export function openProject() {
  const { initSettings } = useSettingStore()
  const { initLayers, setLayerCounter } = useLayerStore()
  const { backgroundLayer, layers } = toRefs(useLayerStore())

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files![0]
    if (!file) return
    const fr = new FileReader()
    fr.onload = async (e) => {
      const data = JSON.parse(e.target!.result as string)

      initSettings(data.settings.width, data.settings.height)
      const backgroundImageData = await base64ToImageData(data.backgroundLayer.background)
      initLayers(backgroundImageData)
      backgroundLayer.value.objects = await Promise.all(
        data.backgroundLayer.objects.map(
          async (object: any) =>
            new LayerObject(
              await base64ToImageData(object.imageData),
              object.x,
              object.y,
              object.width,
              object.height,
              object.offsetX,
              object.offsetY
            )
        )
      )

      backgroundLayer.value.render()

      data.layers.forEach(async (layer: any) => {
        const newLayer = new Layer(layer.name, layer.order)
        newLayer.objects = await Promise.all(
          layer.objects.map(
            async (object: any) =>
              new LayerObject(
                await base64ToImageData(object.imageData),
                object.x,
                object.y,
                object.width,
                object.height,
                object.offsetX,
                object.offsetY
              )
          )
        )

        newLayer.render()
        layers.value.push(newLayer)
      })

      setLayerCounter(data.layerCounter)
    }
    fr.readAsText(file)
  }
  input.click()
}

export function openImage() {
  const { initSettings } = useSettingStore()
  const { initLayers } = useLayerStore()

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files![0]
    if (!file) return
    const fr = new FileReader()
    fr.onload = (e) => {
      const cvs = document.createElement('canvas')
      const ctx = cvs.getContext('2d')!
      const img = new Image()
      img.onload = () => {
        cvs.width = img.width
        cvs.height = img.height

        ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
        initSettings(cvs.width, cvs.height)
        initLayers(ctx.getImageData(0, 0, cvs.width, cvs.height))
      }
      img.src = e.target!.result as string
    }
    fr.readAsDataURL(file)
  }
  input.click()
}

export function saveProject() {
  const { layers, backgroundLayer, getLayerCounter } = useLayerStore()
  const { settings } = useSettingStore()
  const data = {
    layerCounter: getLayerCounter(),
    settings: {
      width: settings.width,
      height: settings.height
    },
    backgroundLayer: {
      background: backgroundLayer.backgroundCanvas.toDataURL(),
      objects: backgroundLayer.objects.map((object) => ({
        imageData: imageData2Base64(object.imageData),
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
        angle: object.angle,
        offsetX: object.offsetX,
        offsetY: object.offsetY
      }))
    },
    layers: layers.slice(2).map((layer) => ({
      name: layer.name,
      order: layer.order,
      objects: layer.objects.map((object) => ({
        imageData: imageData2Base64(object.imageData),
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
        angle: object.angle,
        offsetX: object.offsetX,
        offsetY: object.offsetY
      }))
    }))
  }

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
  a.download = 'project.json'
  a.click()
}

export function saveImage() {
  const { sortedLayers } = useLayerStore()
  const { settings } = useSettingStore()

  const cvs = document.createElement('canvas')
  cvs.width = settings.width
  cvs.height = settings.height
  const ctx = cvs.getContext('2d')!

  sortedLayers.forEach((layer) => {
    const { canvas } = layer.getRenderedObjectCanvas()
    ctx.drawImage(canvas, 0, 0)
  })

  const a = document.createElement('a')
  a.href = cvs.toDataURL()
  a.download = 'image.png'
  a.click()
}

export function undo() {
  const { undo } = useHistoryStore()
  undo()
}

export function redo() {
  const { redo } = useHistoryStore()
  redo()
}

function applyFilter(callback: (imageData: ImageData) => ImageData) {
  const { selection } = useSelectionStore()
  const { currentLayer, backgroundLayer } = useLayerStore()
  const { commitHistory } = useHistoryStore()
  if (!selection || !currentLayer) return

  const commits: (() => void)[] = []
  const rollbacks: (() => void)[] = []
  if (currentLayer === backgroundLayer) {
    const imageData = backgroundLayer.backgroundCtx.getImageData(
      selection.x,
      selection.y,
      selection.width,
      selection.height
    )

    const data = imageData.data
    if (data.some((v) => v !== 0)) {
      const copyImageData = backgroundLayer.backgroundCtx.createImageData(
        selection.width,
        selection.height
      )
      copyImageData.data.set(data)
      const newImageData = callback(copyImageData)

      commits.push(() => {
        backgroundLayer.backgroundCtx.putImageData(newImageData, selection.x, selection.y)
      })

      rollbacks.push(() => {
        backgroundLayer.backgroundCtx.putImageData(imageData, selection.x, selection.y)
      })
    }
  }

  currentLayer.objects.forEach((object) => {
    const { x, y, width, height } = object
    if (
      x + width < selection.x ||
      x > selection.x + selection.width ||
      y + height < selection.y ||
      y > selection.y + selection.height
    ) {
      return
    }

    const imageData = object.ctx.getImageData(
      selection.x - x,
      selection.y - y,
      selection.width,
      selection.height
    )

    const copyImageData = object.ctx.createImageData(selection.width, selection.height)
    copyImageData.data.set(imageData.data)
    const newImageData = callback(copyImageData)

    commits.push(() => {
      object.ctx.putImageData(newImageData, selection.x - x, selection.y - y)
    })

    rollbacks.push(() => {
      object.ctx.putImageData(imageData, selection.x - x, selection.y - y)
    })
  })

  if (commits.length === 0) return

  commitHistory(
    () => {
      commits.forEach((commit) => commit())
      currentLayer.render()
    },
    () => {
      rollbacks.forEach((rollback) => rollback())
      currentLayer.render()
    }
  )
}

export function grayscale() {
  applyFilter((imageData) => {
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }

    return imageData
  })
}

export function invert() {
  applyFilter((imageData) => {
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }

    return imageData
  })
}

export function blur() {
  applyFilter((imageData) => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    const newData = new Uint8ClampedArray(data.length)

    for (let i = 0; i < data.length; i++) {
      if (i % 4 === 3) {
        newData[i] = data[i]
        continue
      }
      const x = (i / 4) % width
      const y = Math.floor(i / 4 / width)

      let avg = 0
      let count = 0
      for (let j = -5; j <= 5; j++) {
        for (let k = -5; k <= 5; k++) {
          const newX = x + j
          const newY = y + k
          if (newX < 0 || newX >= width || newY < 0 || newY >= height) continue

          const index = (newY * width + newX) * 4
          avg += data[index]
          count++
        }
      }

      avg /= count

      newData[i] = avg
    }

    return new ImageData(newData, width, height)
  })
}

export function oilPainting() {
  applyFilter((imageData) => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    const newData = new Uint8ClampedArray(data.length)

    for (let i = 0; i < data.length; i++) {
      if (i % 4 === 3) {
        newData[i] = data[i]
        continue
      }
      const x = (i / 4) % width
      const y = Math.floor(i / 4 / width)

      const countMap = new Map<number, number>()
      for (let j = -2; j <= 2; j++) {
        for (let k = -2; k <= 2; k++) {
          const newX = x + j
          const newY = y + k
          if (newX < 0 || newX >= width || newY < 0 || newY >= height) continue

          const index = (newY * width + newX) * 4
          const color = data[index]
          if (countMap.has(color)) {
            countMap.set(color, countMap.get(color)! + 1)
          } else {
            countMap.set(color, 1)
          }
        }
      }

      let maxCount = 0
      let maxColor = 0
      countMap.forEach((count, color) => {
        if (count > maxCount) {
          maxCount = count
          maxColor = color
        }
      })

      newData[i] = maxColor
    }

    return new ImageData(newData, width, height)
  })
}

export function blackAndWhite() {
  applyFilter((imageData) => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    const newData = new Uint8ClampedArray(data.length)

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width
      const y = Math.floor(i / 4 / width)

      const index = (y * width + x) * 4
      newData[i] = data[index] > 128 ? 255 : 0
      newData[i + 1] = data[index] > 128 ? 255 : 0
      newData[i + 2] = data[index] > 128 ? 255 : 0
      newData[i + 3] = data[index + 3]
    }

    return new ImageData(newData, width, height)
  })
}
