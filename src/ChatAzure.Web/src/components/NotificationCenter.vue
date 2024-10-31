<template>

  <div class="fixed bottom-4 right-4 z-50 space-y-2">

    <TransitionGroup name="notification">

      <Notification

        v-for="notification in notifications"

        :key="notification.id"

        :notification="notification"

        @dismiss="dismissNotification(notification.id)"

        auto-dismiss

      />

    </TransitionGroup>

  </div>

</template>



<script setup lang="ts">

import { computed } from 'vue'

import { useUIStore } from '@/stores/ui'

import Notification from './Notification.vue'



const uiStore = useUIStore()

const notifications = computed(() => uiStore.notifications)



function dismissNotification(id: string) {

  uiStore.markNotificationAsRead(id)

}

</script>



<style scoped>

.notification-enter-active,

.notification-leave-active {

  transition: all 0.3s ease;

}



.notification-enter-from {

  opacity: 0;

  transform: translateX(30px);

}



.notification-leave-to {

  opacity: 0;

  transform: translateX(30px);

}

</style> 
