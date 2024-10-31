import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'
import { useAuthStore } from '@/stores/auth'
import type { ChatMessage } from '@/types/chat'

export class SignalRService {
    private connection: HubConnection | null = null
    private reconnectAttempts = 0
    private readonly maxReconnectAttempts = 5

    constructor(private readonly hubUrl: string) {}

    async connect(sessionId: string): Promise<void> {
        const authStore = useAuthStore()
        const token = await authStore.getAccessToken()

        this.connection = new HubConnectionBuilder()
            .withUrl(`${this.hubUrl}?sessionId=${sessionId}`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
                        return null
                    }
                    return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000)
                }
            })
            .configureLogging(LogLevel.Information)
            .build()

        await this.connection.start()
    }

    onMessage(callback: (message: ChatMessage) => void): void {
        this.connection?.on('ReceiveMessage', callback)
    }

    onTyping(callback: () => void): void {
        this.connection?.on('UserTyping', callback)
    }

    onStopTyping(callback: () => void): void {
        this.connection?.on('UserStoppedTyping', callback)
    }

    async sendMessage(sessionId: string, message: Partial<ChatMessage>): Promise<void> {
        await this.connection?.invoke('SendMessage', sessionId, message)
    }

    async startTyping(sessionId: string): Promise<void> {
        await this.connection?.invoke('StartTyping', sessionId)
    }

    async stopTyping(sessionId: string): Promise<void> {
        await this.connection?.invoke('StopTyping', sessionId)
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.stop()
            this.connection = null
        }
    }
}

export const signalRService = new SignalRService(import.meta.env.VITE_API_BASE_URL + '/chatHub')