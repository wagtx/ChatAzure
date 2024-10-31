<template>
  <div 
    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
    :class="bgColorClass"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string;
}>()

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const bgColorClass = computed(() => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500'
  ]
  const index = props.name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
})
</script> 