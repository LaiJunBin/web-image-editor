import { toRefs } from 'vue'
import { useHistoryStore } from '../history'

describe('history store', () => {
  test('clearHistory should clear history', () => {
    const { clearHistory, commitHistory, historyLength } = toRefs(useHistoryStore())
    commitHistory.value(
      () => {},
      () => {}
    )
    commitHistory.value(
      () => {},
      () => {}
    )
    expect(historyLength.value).toBe(2)
    clearHistory.value()
    expect(historyLength.value).toBe(0)
  })

  test('commitHistory should execute fn', () => {
    const { commitHistory } = toRefs(useHistoryStore())
    const fn = vi.fn()
    commitHistory.value(fn, () => {})
    expect(fn).toHaveBeenCalled()
  })

  test('undo should rollback fn', () => {
    const { commitHistory, undo } = toRefs(useHistoryStore())
    const fn = vi.fn()
    const rollback = vi.fn()
    commitHistory.value(fn, rollback)
    undo.value()
    expect(rollback).toHaveBeenCalled()
  })

  test('redo should execute fn', () => {
    const { commitHistory, redo, undo } = toRefs(useHistoryStore())
    const fn = vi.fn()
    commitHistory.value(fn, () => {})
    undo.value()
    redo.value()
    expect(fn).toHaveBeenCalled()
  })

  test('canUndo should be true when historyIndex > -1', () => {
    const { canUndo, commitHistory, undo } = toRefs(useHistoryStore())
    expect(canUndo.value).toBe(false)
    commitHistory.value(
      () => {},
      () => {}
    )
    expect(canUndo.value).toBe(true)
    undo.value()
    expect(canUndo.value).toBe(false)
  })

  test('canRedo should be true when historyIndex < history.length - 1', () => {
    const { canRedo, commitHistory, undo, redo } = toRefs(useHistoryStore())
    expect(canRedo.value).toBe(false)
    commitHistory.value(
      () => {},
      () => {}
    )
    expect(canRedo.value).toBe(false)
    undo.value()
    expect(canRedo.value).toBe(true)
    redo.value()
    expect(canRedo.value).toBe(false)
  })
})
