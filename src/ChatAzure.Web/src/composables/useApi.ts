import { ref } from 'vue'

import type { ApiResponse, ApiError } from '@/types/api'

import { fetchWithAuth } from '@/utils/http'



export function useApi<T>() {

    const data = ref<T | null>(null)

    const error = ref<ApiError | null>(null)

    const loading = ref(false)



    async function execute<R = T>(

        endpoint: string,

        options?: RequestInit

    ): Promise<R | null> {

        loading.value = true

        error.value = null



        try {

            const response = await fetchWithAuth<ApiResponse<R>>(endpoint, options)

            data.value = response.data as any

            return response.data

        } catch (err) {

            error.value = err as ApiError

            return null

        } finally {

            loading.value = false

        }

    }



    return {

        data,

        error,

        loading,

        execute

    }

} 
