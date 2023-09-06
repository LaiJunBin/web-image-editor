<script setup lang="ts">
import TheNavbar from './components/navbar/TheNavbar.vue'
import TheTools from './components/TheTools.vue'
import { menus } from './const/menus'
import { createMenuAction } from './actions/menu-action'
import { DEFAULT_TOOL, tools } from './const/tools'
import TheControls from './components/TheControls.vue'
import { toRaw, toRefs } from 'vue'
import TheCanvas from './components/TheCanvas.vue'
import { useToolStore } from './stores/tool'
import { MenuAction } from './const/menu-action'
import { useSettingStore } from './stores/setting'
import { useLayerStore } from './stores/layer'
import { useModalStore } from './stores/modal'

const menuAction = createMenuAction()

const { tool, setTool } = toRefs(useToolStore())
const { initSettings } = useSettingStore()
const { initLayers } = useLayerStore()
const { modal } = toRefs(useModalStore())

initSettings(640, 480)
initLayers('#fff')

setTool.value(DEFAULT_TOOL)

const onKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    switch (true) {
      case e.key.toLowerCase() === 'z':
        e.preventDefault()
        menuAction.dispatch(MenuAction.UNDO)
        break
      case e.key.toLowerCase() === 'y':
        e.preventDefault()
        menuAction.dispatch(MenuAction.REDO)
        break
    }
  }
}

window.addEventListener('keydown', onKeydown)
</script>

<template>
  <section class="h-screen">
    <TheNavbar
      :menus="menus"
      @menu-action="(e) => menuAction.dispatch(e)"
      style="grid-area: TheNavbar"
    />
    <TheTools :tools="tools" style="grid-area: TheTools" />
    <TheCanvas style="grid-area: TheCanvas" />
    <TheControls :tool="tool" style="grid-area: TheControls" />
  </section>

  <component :is="toRaw(modal)" v-if="modal" />
</template>

<style scoped>
section {
  display: grid;
  grid-template: 'TheNavbar TheNavbar TheNavbar' 'TheTools TheCanvas TheControls';
  grid-template-columns: 2.5rem 3fr 1fr;
  grid-template-rows: max-content 1fr;
  align-items: flex-start;
}
</style>
