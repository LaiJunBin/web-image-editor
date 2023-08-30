<script setup lang="ts">
import TheNavbar from './components/navbar/TheNavbar.vue'
import { menus } from './const/menus'
import { createMenuAction } from './actions/menu-action'

const menuAction = createMenuAction()
</script>

<template>
  <section class="h-screen">
    <TheNavbar :menus="menus" @menu-action="(e) => menuAction.dispatch(e)" />
  </section>
</template>
