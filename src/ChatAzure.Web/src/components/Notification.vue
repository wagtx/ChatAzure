<template>
  <div
    v-if="notification"
    :class="[
      'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md transition-all duration-300',
      typeClasses[notification.type]
    ]"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          v-if="notification.type === 'success'"
          class="h-6 w-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else-if="notification.type === 'error'"
          class="h-6 w-6 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div class="ml-3 w-0 flex-1">
        <p class="text-sm font-medium">
          {{ notification.message }}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0 flex">
        <button
          @click="dismiss"
          class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Notification } from '@/types/store'

const props = defineProps<{
  notification: Notification
  autoDismiss?: boolean
  duration?: number
}>()

const emit = defineEmits(['dismiss'])

const typeClasses = {
  success: 'bg-green-50 text-green-800',
  error: 'bg-red-50 text-red-800',
  warning: 'bg-yellow-50 text-yellow-800',
  info: 'bg-blue-50 text-blue-800'
}

const dismiss = () => {
  emit('dismiss')
}

onMounted(() => {
  if (props.autoDismiss) {
    setTimeout(dismiss, props.duration || 5000)
  }
})
</script> 