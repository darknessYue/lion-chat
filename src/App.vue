<script setup lang="ts">
import Chatbox from './components/ChatLion/ChatLion.vue'

const options = {
  url: import.meta.env.VITE_OPENAI_API_URL,
  key: import.meta.env.VITE_OPENAI_API_KEY,
  tool: true
}

console.log(options)

</script>

<template>
  <!-- <router-view /> -->
   <Chatbox :options="options" />
</template>

<style>
</style>
