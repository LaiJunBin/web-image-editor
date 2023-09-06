import { defineStore } from 'pinia'
import { type Component, ref, type Raw, toRaw } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const modal = ref<Raw<Component> | null>(null)

  const openModal = (newModal: Component) => {
    modal.value = toRaw(newModal)
  }

  const closeModal = () => {
    modal.value = null
  }

  return { modal, openModal, closeModal }
})
