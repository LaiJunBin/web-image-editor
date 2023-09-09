<script setup lang="ts">
import { useSettingStore } from '@/stores/setting'
import { ref, watch } from 'vue'
import z from 'zod'

const scaleSchema = z
  .string()
  .regex(/(\d+)%$/)
  .transform((value) => {
    const scale = /(\d+)%$/.exec(value)?.[1] ?? '1'
    return parseInt(scale)
  })
  .refine((value) => {
    return value >= 1 && value <= 1000
  })

const input = ref<HTMLInputElement | null>(null)
const { settings } = useSettingStore()
const scale = ref(`${settings.scale}%`)

watch(
  () => scale.value,
  (newValue, oldValue) => {
    const result = scaleSchema.safeParse(newValue)
    if (result.success) {
      settings.scale = result.data
      const oldResult = scaleSchema.safeParse(oldValue)
      if (oldResult.success) {
        input.value?.setCustomValidity('')
      }
    } else {
      input.value?.click()
      input.value?.setCustomValidity('Scale must be between 1% and 1000%')
      input.value?.reportValidity()
      scale.value = oldValue
    }
  }
)

watch(
  () => settings.scale,
  (newValue) => {
    scale.value = `${newValue}%`
  }
)
</script>
<template>
  <footer class="z-30 bg-neutral-700 px-2 py-1">
    <input
      type="text"
      ref="input"
      v-model="scale"
      class="border bg-transparent pr-2 text-right"
      size="5"
    />
  </footer>
</template>
