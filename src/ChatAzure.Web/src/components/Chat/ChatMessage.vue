<template>
  <div
    :class="[
      'flex',
      message.sender.type === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <div
      :class="[
        'max-w-xs lg:max-w-md p-4 rounded-lg shadow',
        message.sender.type === 'user'
          ? 'bg-blue-500 text-white ml-auto'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      ]"
    >
      <div class="flex items-start">
        <UserAvatar
          v-if="message.sender.type !== 'user'"
          :name="message.sender.id"
          class="w-8 h-8 mr-2"
        />
        <div>
          <div class="prose dark:prose-invert" v-html="formattedContent"></div>
          <div class="mt-1 text-xs opacity-70">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '@/types/chat'
import { formatTime } from '@/utils/dateFormat'
import UserAvatar from '../UserAvatar.vue'
import { marked } from 'marked'

const props = defineProps<{
  message: ChatMessage
}>()

const formattedContent = computed(() => {
  return marked(props.message.content, { breaks: true })
})
</script> 