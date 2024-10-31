<template>

  <div class="container mx-auto px-4 py-8">

    <h1 class="text-3xl font-bold mb-8">Welcome to ChatAzure</h1>

    <div class="grid gap-6">

      <div v-for="session in sessions" :key="session.sessionId" class="bg-white p-6 rounded-lg shadow">

        <div class="flex justify-between items-center">

          <h2 class="text-xl font-semibold">Chat Session</h2>

          <span class="text-sm text-gray-500">{{ formatDate(session.startTime) }}</span>

        </div>

        <p class="text-gray-600 mt-2">Last active: {{ formatRelativeTime(session.lastActiveTime) }}</p>

        <div class="mt-4 flex justify-end space-x-4">

          <router-link 

            :to="`/chat/${session.sessionId}`"

            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"

          >

            Continue Chat

          </router-link>

          <button

            @click="deleteSession(session.sessionId)"

            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"

          >

            Delete

          </button>

        </div>

      </div>

      <button

        @click="createNewSession"

        class="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"

      >

        <span class="text-xl">+ Start New Chat</span>

      </button>

    </div>

  </div>

</template>



<script setup lang="ts">

import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { formatDate, formatRelativeTime } from '@/utils/dateFormat'

import type { ChatSession } from '@/types/chat'



const router = useRouter()

const sessions = ref<ChatSession[]>([])



onMounted(async () => {

  try {

    const response = await fetch('/api/v1/chat/sessions')

    if (response.ok) {

      sessions.value = await response.json()

    }

  } catch (error) {

    console.error('Error loading sessions:', error)

  }

})



async function createNewSession() {

  try {

    const response = await fetch('/api/v1/chat/sessions', {

      method: 'POST'

    })

    if (response.ok) {

      const session = await response.json()

      router.push(`/chat/${session.sessionId}`)

    }

  } catch (error) {

    console.error('Error creating session:', error)

  }

}



async function deleteSession(sessionId: string) {

  try {

    const response = await fetch(`/api/v1/chat/sessions/${sessionId}`, {

      method: 'DELETE'

    })

    if (response.ok) {

      sessions.value = sessions.value.filter(s => s.sessionId !== sessionId)

    }

  } catch (error) {

    console.error('Error deleting session:', error)

  }

}

</script> 
