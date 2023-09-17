import { useHistoryStore } from '@/stores/history'
import { MenuAction } from './menu-action'

export interface MenuType<T> {
  text: string
  children: {
    text: string
    action: T
    disabled?: () => boolean
  }[]
}

export const menus: MenuType<MenuAction>[] = [
  {
    text: '檔案',
    children: [
      {
        text: '新增專案',
        action: MenuAction.NEW_PROJECT
      },
      {
        text: '開啟專案',
        action: MenuAction.OPEN_PROJECT
      },
      {
        text: '儲存專案',
        action: MenuAction.SAVE_PROJECT
      },
      {
        text: '開啟圖片',
        action: MenuAction.OPEN_IMAGE
      },
      {
        text: '儲存圖片',
        action: MenuAction.SAVE_IMAGE
      }
    ]
  },
  {
    text: '編輯',
    children: [
      {
        text: '復原',
        action: MenuAction.UNDO,
        disabled: () => !useHistoryStore().canUndo
      },
      {
        text: '重做',
        action: MenuAction.REDO,
        disabled: () => !useHistoryStore().canRedo
      }
    ]
  },
  {
    text: '濾鏡',
    children: [
      {
        text: '灰階',
        action: MenuAction.GRAYSCALE
      },
      {
        text: '負片',
        action: MenuAction.INVERT
      },
      {
        text: '模糊',
        action: MenuAction.BLUR
      },
      {
        text: '油畫',
        action: MenuAction.OIL_PAINTING
      },
      {
        text: '黑白',
        action: MenuAction.BLACK_AND_WHITE
      }
    ]
  }
]
