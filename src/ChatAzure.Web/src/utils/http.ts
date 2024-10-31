import { useAuthStore } from '@/stores/auth'

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
    const authStore = useAuthStore()
    const token = await authStore.getAccessToken()

    const url = new URL(endpoint, import.meta.env.VITE_API_BASE_URL)
    if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
        })
    }

    const response = await fetch(url.toString(), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API request failed')
    }

    return response.json()
} 
