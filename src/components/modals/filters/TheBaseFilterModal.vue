<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import { ref } from 'vue'
import { functionToString } from '@/utils'
import { getSelectedObjectsImageDataAndCtx, previewFilter, applyFilter } from '@/utils/menu-action'
import { useLayerStore } from '@/stores/layer'

interface Props {
  title: string
  callback: CallableFunction
  args: any[]
}

const props = defineProps<Props>()

const { closeModal } = useModalStore()

const worker = new Worker('src/workers/worker.ts', { type: 'module' })
const applyFunc = ref(() => {})
worker.onmessage = (e) => {
  const { newObjectsImageData } = e.data
  previewFilter(newObjectsImageData)
  applyFunc.value = () => {
    applyFilter(newObjectsImageData)
  }
}

const postMessage = () => {
  const objects = getSelectedObjectsImageDataAndCtx()
  const objectsImageData = objects.map((object) => object.imageData)
  worker.postMessage({
    args: props.args,
    objectsImageData,
    callback: functionToString(props.callback)
  })
}

const close = () => {
  const { currentLayer } = useLayerStore()
  currentLayer!.render()
  closeModal()
}

const apply = () => {
  applyFunc.value()
  closeModal()
}

defineExpose({
  postMessage
})

postMessage()
</script>

<template>
  <div
    id="small-modal"
    tabindex="-1"
    class="fixed left-0 right-0 top-0 z-50 h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-50 p-4 md:inset-0"
  >
    <div class="relative mx-auto max-h-full w-full max-w-md">
      <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
        <div class="flex items-center justify-between rounded-t border-b p-2 dark:border-gray-600">
          <h3 class="text-xl font-medium text-gray-900 dark:text-white">{{ props.title }}</h3>
          <button
            type="button"
            class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            @click="close"
          >
            <svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-2 text-black">
          <slot></slot>
          <div class="m-2">
            <button class="w-full bg-blue-500 px-4 py-2 text-white" @click="apply">套用</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
