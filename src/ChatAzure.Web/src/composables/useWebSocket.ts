import { ref, onMounted, onUnmounted } from 'vue'

import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'

import { useAuthStore } from '@/stores/auth'



export function useWebSocket(hubUrl: string) {

    const connection = ref<HubConnection | null>(null)

    const connected = ref(false)

    const error = ref<Error | null>(null)



    async function connect() {

        const authStore = useAuthStore()

        const token = await authStore.getAccessToken()



        connection.value = new HubConnectionBuilder()

            .withUrl(hubUrl, {

                accessTokenFactory: () => token

            })

            .withAutomaticReconnect()

            .build()



        try {

            await connection.value.start()

            connected.value = true

        } catch (err) {

            error.value = err as Error

            connected.value = false

        }

    }



    async function disconnect() {

        if (connection.value) {

            await connection.value.stop()

            connected.value = false

        }

    }



    onMounted(() => {

        connect()

    })



    onUnmounted(() => {

        disconnect()

    })



    return {

        connection,

        connected,

        error,

        connect,

        disconnect

    }

} 
