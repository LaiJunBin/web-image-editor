<script setup lang="ts">
import { useSealStore } from '@/stores/seal'
import { computed, toRefs } from 'vue'
import { Seal } from '@/models/Seal'
import { useSettingStore } from '@/stores/setting'

const { settings } = useSettingStore()
const { seals, currentSeal, addSeal, deleteSeal, selectedSeal } = toRefs(useSealStore())
const size = computed({
  get: () => currentSeal.value?.size || 0,
  set: (value) => {
    if (!currentSeal.value) return
    currentSeal.value.size = value
  }
})

const openFile = () => {
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
        addSeal.value(new Seal(cvs, 50))
      }
      img.src = e.target!.result as string
    }
    fr.readAsDataURL(file)
  }
  input.click()
}
</script>

<template>
  <span class="text-xl font-bold">圖樣大小</span>
  <div class="flex items-center">
    <input
      type="range"
      min="1"
      :max="Math.min(settings.width, settings.height)"
      v-model="size"
      class="flex-grow disabled:cursor-no-drop"
      :disabled="!currentSeal"
    />
    <span class="ml-2">{{ size }}</span>
  </div>
  <hr class="my-2" />
  <span class="flex items-center text-xl font-bold">
    選擇圖樣
    <button
      class="ml-2 flex h-6 w-6 items-center justify-center rounded-sm border border-neutral-500 transition hover:bg-neutral-600"
      @click="openFile"
    >
      +
    </button>
  </span>
  <div class="my-2 grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] justify-items-center border">
    <div v-for="(seal, i) in seals" :key="i" @click="selectedSeal(seal)" class="relative">
      <img
        :src="seal.canvas.toDataURL()"
        alt="seal"
        width="50"
        height="50"
        class="h-[50px] w-[50px] border object-contain"
        :class="currentSeal === seal ? 'border-red-500' : ''"
      />
      <button
        class="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-sm border bg-red-500 transition hover:bg-red-600"
        @click.stop="deleteSeal(seal)"
      >
        x
      </button>
    </div>
  </div>
</template>
