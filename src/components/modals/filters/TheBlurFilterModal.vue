<script setup lang="ts">
import { ref } from 'vue'
import TheBaseFilterModal from './TheBaseFilterModal.vue'

const baseModal = ref<InstanceType<typeof TheBaseFilterModal>>()
const value = ref(2)

const blur = (imageData: ImageData, radius: number) => {
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
    for (let j = -radius; j <= radius; j++) {
      for (let k = -radius; k <= radius; k++) {
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
}

const valueChange = () => {
  baseModal.value?.postMessage()
}
</script>

<template>
  <TheBaseFilterModal title="模糊效果" :args="[value]" :callback="blur" ref="baseModal">
    <div class="mx-4">
      <input type="range" class="w-full" v-model="value" min="2" max="10" @change="valueChange" />
    </div>
  </TheBaseFilterModal>
</template>
