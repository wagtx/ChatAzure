<template>

  <div class="h-screen">

    <ChatWindow :sessionId="sessionId" />

  </div>

</template>



<script setup lang="ts">

import { useRoute } from 'vue-router'

import ChatWindow from '@/components/ChatWindow.vue'



const route = useRoute()

const sessionId = route.params.sessionId as string

</script> 
