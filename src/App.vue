<script setup lang="ts">
import TheNavbar from './components/navbar/TheNavbar.vue'
import TheTools from './components/TheTools.vue'
import { menus } from './const/menus'
import { createMenuAction } from './actions/menu-action'
import { DEFAULT_TOOL, tools } from './const/tools'
import TheControls from './components/TheControls.vue'
import { toolStoreFactory } from './stores/tool'
import { toRefs } from 'vue'
import type { ToolOptions } from './models/Tool'

const menuAction = createMenuAction()

const useToolStore = toolStoreFactory<ToolOptions>()
const { tool, setTool } = toRefs(useToolStore())
setTool.value(DEFAULT_TOOL)
</script>

<template>
  <section class="h-screen">
    <TheNavbar
      :menus="menus"
      @menu-action="(e) => menuAction.dispatch(e)"
      style="grid-area: TheNavbar"
    />
    <TheTools :tools="tools" style="grid-area: TheTools" />
    <TheControls :tool="tool" style="grid-area: TheControls" />
  </section>
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
