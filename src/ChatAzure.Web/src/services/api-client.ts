import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'
import type { ChatMessage, ChatSession } from '@/types/chat'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiClient {
    private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
        const authStore = useAuthStore()
        const token = await authStore.getAccessToken()

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        })

        if (!response.ok) {
            const error = await response.json()
            logger.error('API error:', error)
            throw new Error(error.message || 'API request failed')
        }

        return response.json()
    }

    // Chat Sessions
    async createSession(): Promise<ChatSession> {
        return this.fetchWithAuth('/api/v1/chat/sessions', { method: 'POST' })
    }

    async getSession(sessionId: string): Promise<ChatSession> {
        return this.fetchWithAuth(`/api/v1/chat/sessions/${sessionId}`)
    }

    async getSessions(): Promise<ChatSession[]> {
        return this.fetchWithAuth('/api/v1/chat/sessions')
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.fetchWithAuth(`/api/v1/chat/sessions/${sessionId}`, { method: 'DELETE' })
    }

    // Messages
    async getMessages(sessionId: string): Promise<ChatMessage[]> {
        return this.fetchWithAuth(`/api/v1/chat/sessions/${sessionId}/messages`)
    }

    async sendMessage(sessionId: string, message: Partial<ChatMessage>): Promise<ChatMessage> {
        return this.fetchWithAuth(`/api/v1/chat/sessions/${sessionId}/messages`, {
            method: 'POST',
            body: JSON.stringify(message)
        })
    }

    // User Settings
    async getUserSettings(): Promise<Record<string, unknown>> {
        return this.fetchWithAuth('/api/v1/user/settings')
    }

    async updateUserSettings(settings: Record<string, unknown>): Promise<void> {
        await this.fetchWithAuth('/api/v1/user/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        })
    }
}

export const apiClient = new ApiClient() 