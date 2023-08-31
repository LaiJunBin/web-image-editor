<script setup lang="ts" generic="T">
import { Tool } from '@/models/Tool'
import { toolStoreFactory } from '@/stores/tool'
import { toRefs } from 'vue'

const props = defineProps<{
  tools: Tool<T>[]
}>()
const { tools } = toRefs(props)

const useToolStore = toolStoreFactory<T>()
const { setTool } = useToolStore()
</script>

<template>
  <div class="z-30 flex flex-col items-start justify-center">
    <button
      v-for="tool in tools"
      :key="tool.name"
      class="bg-neutral-700 px-2 py-1 transition hover:bg-neutral-600"
      :class="{
        '!bg-neutral-500': tool.isActive
      }"
      @click="setTool(tool)"
    >
      <component :is="tool.component" />
    </button>
  </div>
</template>
