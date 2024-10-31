import { ref } from 'vue'

export function useLoading(defaultState = false) {
    const isLoading = ref(defaultState)

    async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
        isLoading.value = true
        try {
            return await fn()
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        withLoading
    }
} 