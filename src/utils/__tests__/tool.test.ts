import { draw } from '../tool'

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

describe('tool utils', () => {
  beforeEach(() => {
    ctx.__clearEvents()
    ctx.__clearDrawCalls()
  })

  test('draw', () => {
    draw(ctx, {
      startX: 0,
      startY: 0,
      endX: 100,
      endY: 100,
      color: '#333',
      lineWidth: 10
    })

    expect(ctx.__getDrawCalls()).toMatchSnapshot()
  })
})
