import NewProjectModalVue from '@/components/modals/NewProjectModal.vue'
import { useModalStore } from '@/stores/modal'
import { useHistoryStore } from '@/stores/history'

export function newProject() {
  const { openModal } = useModalStore()
  openModal(NewProjectModalVue)
}

export function openProject() {
  console.log('open project')
}

export function uploadImage() {
  console.log('upload image')
}

export function saveProject() {
  console.log('save project')
}

export function saveImage() {
  console.log('save image')
}

export function undo() {
  const { undo } = useHistoryStore()
  undo()
}

export function redo() {
  const { redo } = useHistoryStore()
  redo()
}
