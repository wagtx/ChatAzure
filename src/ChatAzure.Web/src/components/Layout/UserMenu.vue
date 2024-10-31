<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <UserAvatar :name="user?.name || 'User'" />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ user?.name }}</span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1">
        <button
          @click="openSettings"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Settings
        </button>
        <button
          @click="signOut"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserAvatar from '../UserAvatar.vue'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)
const user = authStore.user

function openSettings() {
  isOpen.value = false
  router.push('/settings')
}

async function signOut() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script> 