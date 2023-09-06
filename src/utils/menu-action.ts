import NewProjectModalVue from '@/components/modals/NewProjectModal.vue'
import { useModalStore } from '@/stores/modal'
import { useHistoryStore } from '@/stores/history'
import { useSettingStore } from '@/stores/setting'
import { useLayerStore } from '@/stores/layer'
import { base64ToImageData, imageData2Base64 } from '.'
import { LayerObject } from '@/models/LayerObject'
import { toRefs } from 'vue'
import { Layer } from '@/models/Layer'

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
              object.height
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
                object.height
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
      background: imageData2Base64(backgroundLayer.backgroundImageData),
      objects: backgroundLayer.objects.map((object) => ({
        imageData: imageData2Base64(object.imageData),
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height,
        angle: object.angle
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
        angle: object.angle
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
    ctx.drawImage(layer.ctx.canvas, 0, 0)
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
