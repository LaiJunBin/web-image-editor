import {
  newProject,
  openProject,
  openImage,
  saveProject,
  saveImage,
  undo,
  redo
} from '@/utils/menu-action'
import { MenuAction, createMenuAction } from '../menu-action'
import { MenuAction as MenuActionConst } from '@/const/menu-action'

const mappedMenuAction: {
  [key in string | number | symbol]: () => void
} = {
  [MenuActionConst.NEW_PROJECT]: newProject,
  [MenuActionConst.OPEN_PROJECT]: openProject,
  [MenuActionConst.OPEN_IMAGE]: openImage,
  [MenuActionConst.SAVE_PROJECT]: saveProject,
  [MenuActionConst.SAVE_IMAGE]: saveImage,
  [MenuActionConst.UNDO]: undo,
  [MenuActionConst.REDO]: redo
}

vi.mock('@/utils/menu-action', () => ({
  newProject: vi.fn(),
  openProject: vi.fn(),
  openImage: vi.fn(),
  saveProject: vi.fn(),
  saveImage: vi.fn(),
  undo: vi.fn(),
  redo: vi.fn()
}))

describe('menu-action', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('register and dispatch', () => {
    const menuAction = new MenuAction()
    const callback = vi.fn()
    menuAction.register('event', callback)
    menuAction.dispatch('event')
    expect(callback).toBeCalledTimes(1)
  })

  test('dispatch not registered action', () => {
    const menuAction = new MenuAction()
    const callback = vi.fn()
    menuAction.dispatch('event')
    expect(callback).not.toBeCalled()
  })

  test('dispatch from createMenuAction', () => {
    const menuAction = createMenuAction()

    for (const action in mappedMenuAction) {
      expect(mappedMenuAction[action]).toBeCalledTimes(0)
    }

    for (const action in mappedMenuAction) {
      menuAction.dispatch(action)
      expect(mappedMenuAction[action]).toBeCalledTimes(1)
    }
  })
})
