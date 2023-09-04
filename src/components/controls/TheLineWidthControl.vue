<script setup lang="ts">
import { toRefs } from 'vue'
import { useSettingStore } from '@/stores/setting'

const { lineWidth } = toRefs(useSettingStore())
</script>

<template>
  <h1 class="flex items-center">
    <span class="text-2xl font-bold">線條粗細</span>
  </h1>
  <hr class="my-2" />

  <div class="flex items-center">
    <input type="range" min="1" max="100" v-model="lineWidth" class="flex-grow" />
    <span class="ml-2">{{ lineWidth }}</span>
  </div>
</template>
