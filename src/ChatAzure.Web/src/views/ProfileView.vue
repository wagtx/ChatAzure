<template>

  <div class="container mx-auto px-4 py-8">

    <h1 class="text-2xl font-bold mb-6">Profile Settings</h1>

    

    <div class="bg-white rounded-lg shadow p-6 space-y-6">

      <div class="space-y-4">

        <div>

          <label class="block text-sm font-medium text-gray-700">Display Name</label>

          <input

            v-model="displayName"

            type="text"

            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"

          />

        </div>

        

        <div>

          <label class="block text-sm font-medium text-gray-700">Email Notifications</label>

          <div class="mt-2 space-y-2">

            <label class="flex items-center">

              <input

                v-model="notifications.newMessage"

                type="checkbox"

                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

              />

              <span class="ml-2">New Messages</span>

            </label>

            <label class="flex items-center">

              <input

                v-model="notifications.sessionExpiry"

                type="checkbox"

                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

              />

              <span class="ml-2">Session Expiry</span>

            </label>

          </div>

        </div>

      </div>

      

      <div class="pt-4">

        <button

          @click="saveProfile"

          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

        >

          Save Profile

        </button>

      </div>

    </div>

  </div>

</template>



<script setup lang="ts">

import { ref } from 'vue'

import { useNotification } from '@/composables/useNotification'



const { showSuccess } = useNotification()



const displayName = ref('')

const notifications = ref({

  newMessage: true,

  sessionExpiry: true

})



async function saveProfile() {

  try {

    // Save profile to backend

    showSuccess('Profile updated successfully')

  } catch (error) {

    console.error('Error saving profile:', error)

  }

}

</script> 
