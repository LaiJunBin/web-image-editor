import { useSettingStore } from '@/stores/setting'
import BrushTool from '../BrushTool'
import { draw } from '@/utils/tool'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!
vi.mock('@/stores/layer', async () => {
  return {
    useLayerStore: () => ({
      recordLayer: {
        ctx,
        save: vi.fn(),
        restore: vi.fn()
      }
    })
  }
})

vi.mock('@/utils/tool', () => {
  return {
    draw: vi.fn()
  }
})

describe('BrushTool', () => {
  test('should draw line on canvas', () => {
    const { setColor, setLineWidth } = useSettingStore()

    setColor('#333')
    setLineWidth(10)

    BrushTool.mousedown({ offsetX: 0, offsetY: 0 } as MouseEvent)
    BrushTool.mousemove({ offsetX: 100, offsetY: 100 } as MouseEvent)
    BrushTool.mouseup({ offsetX: 100, offsetY: 100 } as MouseEvent)

    expect(draw).toHaveBeenCalled()
    expect(draw).toBeCalledWith(
      ctx,
      expect.objectContaining({
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 100,
        color: '#333',
        lineWidth: 10
      })
    )
  })
})
