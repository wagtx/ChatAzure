<template>

  <div class="container mx-auto px-4 py-8">

    <h1 class="text-2xl font-bold mb-6">Settings</h1>

    

    <div class="bg-white rounded-lg shadow p-6 space-y-6">

      <div>

        <h2 class="text-lg font-semibold mb-4">Chat Preferences</h2>

        <div class="space-y-4">

          <div class="flex items-center justify-between">

            <span>Dark Mode</span>

            <button 

              @click="uiStore.toggleDarkMode"

              class="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"

              :class="uiStore.darkMode ? 'bg-blue-600' : 'bg-gray-200'"

            >

              <span 

                class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"

                :class="uiStore.darkMode ? 'translate-x-6' : 'translate-x-1'"

              />

            </button>

          </div>

          

          <div class="flex items-center justify-between">

            <span>Notifications</span>

            <button 

              @click="toggleNotifications"

              class="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"

              :class="notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'"

            >

              <span 

                class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"

                :class="notificationsEnabled ? 'translate-x-6' : 'translate-x-1'"

              />

            </button>

          </div>

        </div>

      </div>

      

      <div>

        <h2 class="text-lg font-semibold mb-4">AI Customization</h2>

        <div class="space-y-4">

          <div>

            <label class="block text-sm font-medium text-gray-700">AI Personality</label>

            <select 

              v-model="aiPersonality"

              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"

            >

              <option value="professional">Professional</option>

              <option value="friendly">Friendly</option>

              <option value="technical">Technical</option>

            </select>

          </div>

          

          <div>

            <label class="block text-sm font-medium text-gray-700">Response Length</label>

            <select 

              v-model="responseLength"

              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"

            >

              <option value="concise">Concise</option>

              <option value="balanced">Balanced</option>

              <option value="detailed">Detailed</option>

            </select>

          </div>

        </div>

      </div>

      

      <div class="pt-4">

        <button

          @click="saveSettings"

          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

        >

          Save Settings

        </button>

      </div>

    </div>

  </div>

</template>



<script setup lang="ts">

import { ref } from 'vue'

import { useUIStore } from '@/stores/ui'

import { useNotification } from '@/composables/useNotification'



const uiStore = useUIStore()

const { showSuccess } = useNotification()



const notificationsEnabled = ref(true)

const aiPersonality = ref('professional')

const responseLength = ref('balanced')



function toggleNotifications() {

  notificationsEnabled.value = !notificationsEnabled.value

}



async function saveSettings() {

  try {

    // Save settings to backend

    showSuccess('Settings saved successfully')

  } catch (error) {

    console.error('Error saving settings:', error)

  }

}

</script> 
