import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

export async function fetchApi(endpoint: string, options: ApiOptions = {}) {
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
