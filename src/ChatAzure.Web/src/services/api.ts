import { useAuthStore } from '@/stores/auth'

import type { ChatMessage, ChatSession } from '@/types/chat'



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL



interface ApiOptions {

    method?: string;

    body?: any;

    headers?: Record<string, string>;

}



async function fetchApi(endpoint: string, options: ApiOptions = {}) {

    const authStore = useAuthStore()

    const token = await authStore.getAccessToken()



    const response = await fetch(`${API_BASE_URL}${endpoint}`, {

        method: options.method || 'GET',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${token}`,

            ...options.headers

        },

        body: options.body ? JSON.stringify(options.body) : undefined

    })



    if (!response.ok) {

        const error = await response.json()

        throw new Error(error.message || 'API request failed')

    }



    return response.json()

}



export const chatApi = {

    async createSession(): Promise<ChatSession> {

        return fetchApi('/api/v1/chat/sessions', { method: 'POST' })

    },



    async getSession(sessionId: string): Promise<ChatSession> {

        return fetchApi(`/api/v1/chat/sessions/${sessionId}`)

    },



    async getSessions(): Promise<ChatSession[]> {

        return fetchApi('/api/v1/chat/sessions')

    },



    async deleteSession(sessionId: string): Promise<void> {

        await fetchApi(`/api/v1/chat/sessions/${sessionId}`, { method: 'DELETE' })

    },



    async getMessages(sessionId: string): Promise<ChatMessage[]> {

        return fetchApi(`/api/v1/chat/sessions/${sessionId}/messages`)

    },



    async sendMessage(sessionId: string, message: Partial<ChatMessage>): Promise<ChatMessage> {

        return fetchApi(`/api/v1/chat/sessions/${sessionId}/messages`, {

            method: 'POST',

            body: message

        })

    }

} 
