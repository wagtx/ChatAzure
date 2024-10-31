import { defineStore } from 'pinia'

import { ref } from 'vue'

import type { Notification } from '@/types/store'



export const useUIStore = defineStore('ui', () => {

    const darkMode = ref(false)

    const sidebarOpen = ref(true)

    const notifications = ref<Notification[]>([])



    function toggleDarkMode() {

        darkMode.value = !darkMode.value

        document.documentElement.classList.toggle('dark')

    }



    function toggleSidebar() {

        sidebarOpen.value = !sidebarOpen.value

    }



    function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {

        notifications.value.push({

            id: crypto.randomUUID(),

            timestamp: new Date(),

            read: false,

            ...notification

        })

    }



    function markNotificationAsRead(id: string) {

        const notification = notifications.value.find(n => n.id === id)

        if (notification) {

            notification.read = true

        }

    }



    function clearNotifications() {

        notifications.value = []

    }



    return {

        darkMode,

        sidebarOpen,

        notifications,

        toggleDarkMode,

        toggleSidebar,

        addNotification,

        markNotificationAsRead,

        clearNotifications

    }

}) 
