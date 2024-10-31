<template>
  <div class="border-t bg-white dark:bg-gray-800 p-4">
    <div class="flex items-end space-x-4">
      <FileUpload
        v-if="allowFileUpload"
        @filesSelected="handleFileUpload"
        @error="handleError"
        class="flex-shrink-0"
      />
      <div class="flex-1 relative">
        <textarea
          v-model="content"
          @keydown.enter.prevent="sendMessage"
          @input="handleTyping"
          placeholder="Type a message..."
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          rows="1"
          ref="inputRef"
        ></textarea>
        <button
          @click="sendMessage"
          class="absolute right-2 bottom-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
          :disabled="!content.trim()"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '../FileUpload.vue'

const props = defineProps({
  allowFileUpload: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['send', 'typing', 'error'])

const content = ref('')
const inputRef = ref<HTMLTextAreaElement | null>(null)
let typingTimeout: NodeJS.Timeout | null = null

function sendMessage() {
  if (!content.value.trim()) return
  
  emit('send', content.value)
  content.value = ''
  adjustTextareaHeight()
}

function handleTyping() {
  adjustTextareaHeight()
  
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  
  emit('typing', true)
  typingTimeout = setTimeout(() => {
    emit('typing', false)
  }, 1000)
}

function handleFileUpload(files: File[]) {
  // Handle file upload
}

function handleError(error: Error) {
  emit('error', error)
}

function adjustTextareaHeight() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = `${inputRef.value.scrollHeight}px`
  }
}
</script> 