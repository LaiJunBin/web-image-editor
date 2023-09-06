<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import { reactive } from 'vue'
import { z } from 'zod'
import Swal from 'sweetalert2'
import { useSettingStore } from '@/stores/setting'
import { useLayerStore } from '@/stores/layer'

const { closeModal } = useModalStore()
const { initSettings } = useSettingStore()
const { initLayersFromColor } = useLayerStore()

const createProjectSchema = z.object({
  width: z.number().int().min(1).max(1024),
  height: z.number().int().min(1).max(768),
  backgroundColor: z.string().regex(/^#[0-9a-f]{6}$/i)
})

const payload = reactive<z.infer<typeof createProjectSchema>>({
  width: 640,
  height: 480,
  backgroundColor: '#ffffff'
})

const createProject = () => {
  const result = createProjectSchema.safeParse(payload)
  if (!result.success) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${result.error.errors[0].path[0]}: ${result.error.errors[0].message}`
    })
    return
  }

  initSettings(payload.width, payload.height)
  initLayersFromColor(payload.backgroundColor)
  closeModal()
}
</script>

<template>
  <div
    id="small-modal"
    tabindex="-1"
    class="fixed left-0 right-0 top-0 z-50 h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-50 p-4 md:inset-0"
  >
    <div class="relative mx-auto max-h-full w-full max-w-md">
      <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
        <div class="flex items-center justify-between rounded-t border-b p-5 dark:border-gray-600">
          <h3 class="text-xl font-medium text-gray-900 dark:text-white">開新專案</h3>
          <button
            type="button"
            class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            @click="closeModal"
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
        <form method="post" @submit.prevent="createProject">
          <div class="space-y-6 p-6 text-black">
            <label class="flex items-center gap-x-2">
              寬度(1-1024)
              <input
                type="number"
                v-model="payload.width"
                class="flex-grow rounded-lg border border-gray-400 px-2 py-1"
              />
            </label>
            <label class="flex items-center gap-x-2">
              高度(1-768)
              <input
                type="number"
                v-model="payload.height"
                class="flex-grow rounded-lg border border-gray-400 px-2 py-1"
              />
            </label>
            <label class="inline-flex items-center gap-x-2">
              背景顏色
              <input type="color" v-model="payload.backgroundColor" class="rounded-lg" />
            </label>
          </div>
          <div
            class="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600"
          >
            <button
              type="submit"
              class="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              建立
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
