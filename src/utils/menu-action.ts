import NewProjectModalVue from '@/components/modals/NewProjectModal.vue'
import { useModalStore } from '@/stores/modal'
import { useHistoryStore } from '@/stores/history'
import { useSettingStore } from '@/stores/setting'
import { useLayerStore } from '@/stores/layer'

export function newProject() {
  const { openModal } = useModalStore()
  openModal(NewProjectModalVue)
}

export function openProject() {
  console.log('open project')
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
  console.log('save project')
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
