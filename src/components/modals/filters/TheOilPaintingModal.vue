<script setup lang="ts">
import { ref } from 'vue'
import TheBaseFilterModal from './TheBaseFilterModal.vue'

const baseModal = ref<InstanceType<typeof TheBaseFilterModal>>()
const value = ref(1)

const oilPainting = (imageData: ImageData, radius: number) => {
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
    for (let j = -radius; j <= radius; j++) {
      for (let k = -radius; k <= radius; k++) {
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
}

const valueChange = () => {
  baseModal.value?.postMessage()
}
</script>

<template>
  <TheBaseFilterModal title="油畫效果" :args="[value]" :callback="oilPainting" ref="baseModal">
    <input type="range" class="w-full" v-model="value" min="2" max="10" @change="valueChange" />
  </TheBaseFilterModal>
</template>
