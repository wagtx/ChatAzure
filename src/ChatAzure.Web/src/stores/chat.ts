import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage, ChatSession } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
    const messages = ref<ChatMessage[]>([])
    const sessions = ref<ChatSession[]>([])
    const currentSession = ref<ChatSession | null>(null)

    async function loadSessions() {
        try {
            const response = await fetch('/api/v1/chat/sessions')
            if (response.ok) {
                sessions.value = await response.json()
            }
        } catch (error) {
            console.error('Error loading sessions:', error)
            throw error
        }
    }

    async function createSession() {
        try {
            const response = await fetch('/api/v1/chat/sessions', {
                method: 'POST'
            })
            if (response.ok) {
                const session = await response.json()
                sessions.value.push(session)
                return session
            }
        } catch (error) {
            console.error('Error creating session:', error)
            throw error
        }
    }

    async function deleteSession(sessionId: string) {
        try {
            const response = await fetch(`/api/v1/chat/sessions/${sessionId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                sessions.value = sessions.value.filter(s => s.sessionId !== sessionId)
            }
        } catch (error) {
            console.error('Error deleting session:', error)
            throw error
        }
    }

    return {
        messages,
        sessions,
        currentSession,
        loadSessions,
        createSession,
        deleteSession
    }
}) 