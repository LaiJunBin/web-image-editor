<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useSettingStore } from '@/stores/setting'

const cvs = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isSelecting = ref(false)
const { setColor } = useSettingStore()

const initPalette = () => {
  if (!cvs.value || !ctx.value) {
    return
  }

  for (let i = 0; i < 180; i++) {
    var gradient = ctx.value.createLinearGradient(i, 0, i + 1, cvs.value.height)
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(0.5, `hsl(${i * 2},100%,50%)`)
    gradient.addColorStop(1, 'black')
    ctx.value.fillStyle = gradient
    ctx.value.fillRect(i, 0, 1, cvs.value.height)
  }
}

const onMousedown = (e: MouseEvent) => {
  isSelecting.value = true
  onMousemove(e)
}

const onMouseup = () => {
  if (isSelecting.value) {
    isSelecting.value = false
    initPalette()
  }
}

const onMousemove = (e: MouseEvent) => {
  if (cvs.value && ctx.value && isSelecting.value === true) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    const x = Math.floor(e.offsetX * (cvs.value.width / rect.width))
    const y = Math.floor(e.offsetY * (cvs.value.height / rect.height))

    initPalette()
    ctx.value.beginPath()
    ctx.value.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.value.stroke()
    ctx.value.closePath()

    const imageData = ctx.value.getImageData(x, y, 1, 1)
    const pixel = imageData.data
    const [r, g, b, a] = pixel
    const color = `rgba(${r}, ${g}, ${b}, ${a})`
    setColor(color)
  }
}

onMounted(() => {
  if (cvs.value) {
    ctx.value = cvs.value.getContext('2d', { willReadFrequently: true })
    initPalette()
  }

  window.addEventListener('mouseup', onMouseup)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onMouseup)
})
</script>

<template>
  <canvas
    ref="cvs"
    width="180"
    height="100"
    @mousedown="onMousedown"
    @mousemove="onMousemove"
    class="w-full"
  ></canvas>
</template>
