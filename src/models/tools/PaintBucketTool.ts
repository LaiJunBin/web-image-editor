import { Tool } from '@/models/Tool'
import type { Component } from 'vue'
import type { Control } from '../Control'
import ThePaintBucketTool from '@/components/tools/ThePaintBucketTool.vue'
import { useLayerStore } from '@/stores/layer'
import { useSettingStore } from '@/stores/setting'
import PaletteControl from '../controls/PaletteControl'

class PaintBucketTool extends Tool {
  constructor(component: Component, controls: Control[] = []) {
    super('油漆桶工具', component, controls)
  }

  mouseover(e: MouseEvent) {}

  mousedown(e: MouseEvent) {
    const { color } = useSettingStore()
    const { currentLayer, recordLayer } = useLayerStore()
    const imageData = recordLayer?.imageData
    const baseImageData = currentLayer?.imageData
    if (!imageData || !baseImageData) return

    const { offsetX, offsetY } = e
    const { data } = imageData
    const { data: baseData } = baseImageData
    const baseIndex = (offsetY * imageData.width + offsetX) * 4
    const baseColor = baseData.slice(baseIndex, baseIndex + 4)
    const fillColor = color
      .match(/rgba\((\d+), (\d+), (\d+), (\d+)\)/)!
      .slice(1)
      .map(Number)

    const queue: [number, number][] = [[offsetY, offsetX]]
    const visited: boolean[][] = Array.from({ length: imageData.height }, () =>
      Array.from({ length: imageData.width }, () => false)
    )

    while (queue.length) {
      const [y, x] = queue.shift()!
      if (visited[y][x]) continue
      visited[y][x] = true

      const index = (y * imageData.width + x) * 4
      const [r, g, b, a] = baseData.slice(index, index + 4)
      if (r === baseColor[0] && g === baseColor[1] && b === baseColor[2] && a === baseColor[3]) {
        data[index] = fillColor[0]
        data[index + 1] = fillColor[1]
        data[index + 2] = fillColor[2]
        data[index + 3] = fillColor[3]

        if (x > 0) queue.push([y, x - 1])
        if (x < imageData.width - 1) queue.push([y, x + 1])
        if (y > 0) queue.push([y - 1, x])
        if (y < imageData.height - 1) queue.push([y + 1, x])
      }
    }

    recordLayer?.ctx.putImageData(imageData, 0, 0)
    recordLayer?.save()
  }

  mousemove(e: MouseEvent) {}

  mouseup(e: MouseEvent) {}

  mouseout(e: MouseEvent) {}

  mousePreview(e: MouseEvent) {}
}

export default new PaintBucketTool(ThePaintBucketTool, [PaletteControl])
