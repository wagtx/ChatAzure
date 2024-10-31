import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useAuthStore } from '@/stores/auth'

export async function createSignalRConnection(hubUrl: string) {
    const authStore = useAuthStore()
    const token = await authStore.getAccessToken()

    return new HubConnectionBuilder()
        .withUrl(hubUrl, {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()
} 