import { useUIStore } from '@/stores/ui'
import type { Notification } from '@/types/store'

export function useNotification() {
    const uiStore = useUIStore()

    function showNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
        uiStore.addNotification(notification)
    }

    function showSuccess(message: string) {
        showNotification({
            type: 'success',
            message
        })
    }

    function showError(message: string) {
        showNotification({
            type: 'error',
            message
        })
    }

    function showWarning(message: string) {
        showNotification({
            type: 'warning',
            message
        })
    }

    function showInfo(message: string) {
        showNotification({
            type: 'info',
            message
        })
    }

    return {
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    }
} 