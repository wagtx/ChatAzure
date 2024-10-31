import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createSignalRConnection } from '@/utils/signalr'
import type { ChatMessage, ChatSession } from '@/types/chat'

export function useChat(sessionId: string) {
    const messages = ref<ChatMessage[]>([])
    const isLoading = ref(true)
    const error = ref<Error | null>(null)
    const connection = ref<signalR.HubConnection | null>(null)
    const isTyping = ref(false)

    async function loadMessages() {
        try {
            const response = await fetch(`/api/v1/chat/sessions/${sessionId}/messages`)
            if (response.ok) {
                messages.value = await response.json()
            }
        } catch (err) {
            error.value = err as Error
        } finally {
            isLoading.value = false
        }
    }

    async function sendMessage(content: string) {
        if (!connection.value) return

        try {
            await connection.value.invoke('SendMessage', sessionId, {
                content,
                timestamp: new Date().toISOString()
            })
        } catch (err) {
            error.value = err as Error
        }
    }

    async function setupConnection() {
        try {
            connection.value = await createSignalRConnection(`/chatHub?sessionId=${sessionId}`)

            connection.value.on('ReceiveMessage', (message: ChatMessage) => {
                messages.value.push(message)
                isTyping.value = false
            })

            connection.value.on('UserTyping', () => {
                isTyping.value = true
            })

            connection.value.on('UserStoppedTyping', () => {
                isTyping.value = false
            })

            await connection.value.start()
        } catch (err) {
            error.value = err as Error
        }
    }

    onMounted(async () => {
        await Promise.all([
            loadMessages(),
            setupConnection()
        ])
    })

    onUnmounted(() => {
        if (connection.value) {
            connection.value.stop()
        }
    })

    return {
        messages,
        isLoading,
        error,
        isTyping,
        sendMessage
    }
} 