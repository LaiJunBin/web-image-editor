import NewProjectModalVue from '@/components/modals/NewProjectModal.vue'
import TheBlurFilterModal from '@/components/modals/filters/TheBlurFilterModal.vue'
import TheOilPaintingModal from '@/components/modals/filters/TheOilPaintingModal.vue'
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

export function getSelectedObjectsImageDataAndCtx(): {
  imageData: ImageData
  ctx: CanvasRenderingContext2D
  x: number
  y: number
}[] {
  const { selection, setSelection } = toRefs(useSelectionStore())
  const { currentLayer, backgroundLayer } = useLayerStore()
  if (!currentLayer) return []
  if (!selection.value) {
    setSelection.value(0, 0, currentLayer.ctx.canvas.width, currentLayer.ctx.canvas.height)
  }

  const output = []
  if (currentLayer === backgroundLayer) {
    const imageData = backgroundLayer.backgroundCtx.getImageData(
      selection.value!.x,
      selection.value!.y,
      selection.value!.width,
      selection.value!.height
    )

    const data = imageData.data
    if (data.some((v) => v !== 0)) {
      const copyImageData = backgroundLayer.backgroundCtx.createImageData(
        selection.value!.width,
        selection.value!.height
      )
      copyImageData.data.set(data)
      output.push({
        imageData: copyImageData,
        ctx: backgroundLayer.backgroundCtx,
        x: selection.value!.x,
        y: selection.value!.y
      })
    }
  }

  return output.concat(
    currentLayer.objects
      .filter((object) => {
        const { x, y, width, height } = object
        return !(
          x + width < selection.value!.x ||
          x > selection.value!.x + selection.value!.width ||
          y + height < selection.value!.y ||
          y > selection.value!.y + selection.value!.height
        )
      })
      .map((object) => {
        const { x, y } = object
        const imageData = object.ctx.getImageData(
          selection.value!.x - x,
          selection.value!.y - y,
          selection.value!.width,
          selection.value!.height
        )

        const copyImageData = object.ctx.createImageData(
          selection.value!.width,
          selection.value!.height
        )
        copyImageData.data.set(imageData.data)
        return {
          imageData: copyImageData,
          ctx: object.ctx,
          x: selection.value!.x - x,
          y: selection.value!.y - y
        }
      })
  )
}

export function previewFilter(newObjectsImageData: ImageData[]) {
  const { currentLayer } = useLayerStore()
  const objects = getSelectedObjectsImageDataAndCtx()
  if (!currentLayer || !objects.length) return

  for (let i = 0; i < newObjectsImageData.length; i++) {
    const newImageData = newObjectsImageData[i]
    const { ctx, x, y } = objects[i]
    ctx.putImageData(newImageData, x, y)
  }

  currentLayer.render()
  for (let i = 0; i < newObjectsImageData.length; i++) {
    const { imageData, ctx, x, y } = objects[i]
    ctx.putImageData(imageData, x, y)
  }
}

export function applyFilter(newObjectsImageData: ImageData[]) {
  const { currentLayer } = useLayerStore()
  const objects = getSelectedObjectsImageDataAndCtx()
  if (!currentLayer || !objects.length) return

  const { commitHistory } = useHistoryStore()
  const commits: (() => void)[] = []
  const rollbacks: (() => void)[] = []

  for (let i = 0; i < newObjectsImageData.length; i++) {
    const newImageData = newObjectsImageData[i]
    const { imageData, ctx, x, y } = objects[i]
    commits.push(() => {
      ctx.putImageData(newImageData, x, y)
    })

    rollbacks.push(() => {
      ctx.putImageData(imageData, x, y)
    })
  }

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
  const objects = getSelectedObjectsImageDataAndCtx()
  const objectsImageData = objects.map((object) => object.imageData)
  objectsImageData.forEach((imageData: ImageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }
  })

  applyFilter(objectsImageData)
}

export function invert() {
  const objects = getSelectedObjectsImageDataAndCtx()
  const objectsImageData = objects.map((object) => object.imageData)
  objectsImageData.forEach((imageData: ImageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
  })

  applyFilter(objectsImageData)
}

export function blur() {
  const { openModal } = useModalStore()
  openModal(<TheBlurFilterModal />)
}

export function oilPainting() {
  const { openModal } = useModalStore()
  openModal(<TheOilPaintingModal />)
}

export function blackAndWhite() {
  const objects = getSelectedObjectsImageDataAndCtx()
  const objectsImageData = objects.map((object) => object.imageData)
  const newObjectsImageData: ImageData[] = []
  objectsImageData.forEach((imageData: ImageData) => {
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
    newObjectsImageData.push(new ImageData(newData, width, height))
  })

  applyFilter(newObjectsImageData)
}
