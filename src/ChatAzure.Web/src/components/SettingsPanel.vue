<template>

  <div class="fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300"

       :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }">

    <div class="h-full flex flex-col">

      <div class="p-4 border-b">

        <div class="flex items-center justify-between">

          <h2 class="text-lg font-semibold">Settings</h2>

          <button @click="close" class="text-gray-500 hover:text-gray-700">

            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />

            </svg>

          </button>

        </div>

      </div>



      <div class="flex-1 overflow-y-auto p-4 space-y-6">

        <!-- Theme Settings -->

        <div>

          <h3 class="text-sm font-medium text-gray-900 mb-2">Theme</h3>

          <div class="flex items-center justify-between">

            <span>Dark Mode</span>

            <button 

              @click="toggleDarkMode"

              class="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"

              :class="darkMode ? 'bg-blue-600' : 'bg-gray-200'"

            >

              <span 

                class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"

                :class="darkMode ? 'translate-x-6' : 'translate-x-1'"

              />

            </button>

          </div>

        </div>



        <!-- AI Settings -->

        <div>

          <h3 class="text-sm font-medium text-gray-900 mb-2">AI Behavior</h3>

          <div class="space-y-4">

            <div>

              <label class="block text-sm text-gray-700">Personality</label>

              <select 

                v-model="settings.aiPersonality"

                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

              >

                <option value="professional">Professional</option>

                <option value="friendly">Friendly</option>

                <option value="technical">Technical</option>

              </select>

            </div>



            <div>

              <label class="block text-sm text-gray-700">Response Length</label>

              <select 

                v-model="settings.responseLength"

                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

              >

                <option value="concise">Concise</option>

                <option value="balanced">Balanced</option>

                <option value="detailed">Detailed</option>

              </select>

            </div>

          </div>

        </div>



        <!-- Notification Settings -->

        <div>

          <h3 class="text-sm font-medium text-gray-900 mb-2">Notifications</h3>

          <div class="space-y-2">

            <label class="flex items-center">

              <input

                v-model="settings.notifications.newMessage"

                type="checkbox"

                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

              />

              <span class="ml-2 text-sm text-gray-700">New Messages</span>

            </label>

            <label class="flex items-center">

              <input

                v-model="settings.notifications.mentions"

                type="checkbox"

                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

              />

              <span class="ml-2 text-sm text-gray-700">Mentions</span>

            </label>

          </div>

        </div>

      </div>



      <div class="p-4 border-t">

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

import { ref, computed } from 'vue'

import { useUIStore } from '@/stores/ui'



const props = defineProps<{

  isOpen: boolean

}>()



const emit = defineEmits(['close', 'save'])



const uiStore = useUIStore()

const darkMode = computed(() => uiStore.darkMode)



const settings = ref({

  aiPersonality: 'professional',

  responseLength: 'balanced',

  notifications: {

    newMessage: true,

    mentions: true

  }

})



function toggleDarkMode() {

  uiStore.toggleDarkMode()

}



function close() {

  emit('close')

}



async function saveSettings() {

  try {

    // Save settings logic here

    emit('save', settings.value)

    close()

  } catch (error) {

    console.error('Error saving settings:', error)

  }

}

</script> 
