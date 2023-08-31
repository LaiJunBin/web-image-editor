<script setup lang="ts">
import type { Tool } from '@/models/Tool'
import type { ToolOptions } from '@/models/Tool'
import { toRefs } from 'vue'

interface Props {
  tool: Tool<ToolOptions>
}

const props = defineProps<Props>()
const { tool } = toRefs(props)
</script>

<template>
  <div class="z-30 h-full bg-neutral-700 px-4">
    <h1 class="border border-neutral-500 px-4 py-2 text-center text-2xl font-bold">
      {{ tool.name }}
    </h1>
    <hr class="my-2" />
    <template v-for="(control, i) in tool.controls" :key="i">
      <component :is="control.component" />
      <hr v-if="i + 1 < tool.controls.length" class="my-2 border-neutral-700" />
    </template>
  </div>
</template>
