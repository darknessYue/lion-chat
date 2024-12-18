<script setup lang="ts">
import Chatbox from './components/ChatLion/ChatLion.vue'

const options = {
  url: '',
  key: '',
  tool: true
}

</script>

<template>
  <!-- <router-view /> -->
   <Chatbox :options="options" />
</template>

<style>
</style>
