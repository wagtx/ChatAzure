import { defineStore } from 'pinia'

import { ref } from 'vue'

import { PublicClientApplication, AccountInfo } from '@azure/msal-browser'



export const useAuthStore = defineStore('auth', () => {

    const user = ref<AccountInfo | null>(null)

    const isAuthenticated = ref(false)



    const msalConfig = {

        auth: {

            clientId: import.meta.env.VITE_AZURE_CLIENT_ID,

            authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,

            redirectUri: window.location.origin,

        },

        cache: {

            cacheLocation: 'sessionStorage',

            storeAuthStateInCookie: false

        }

    }



    const msalInstance = new PublicClientApplication(msalConfig)



    async function initialize() {

        try {

            await msalInstance.handleRedirectPromise()

            const accounts = msalInstance.getAllAccounts()

            if (accounts.length > 0) {

                user.value = accounts[0]

                isAuthenticated.value = true

            }

        } catch (error) {

            console.error('Error initializing auth:', error)

        }

    }



    async function login() {

        try {

            const result = await msalInstance.loginPopup({

                scopes: ['User.Read', 'api://chatazure/chat.access']

            })

            user.value = result.account

            isAuthenticated.value = true

        } catch (error) {

            console.error('Login failed:', error)

            throw error

        }

    }



    async function logout() {

        try {

            await msalInstance.logoutPopup({

                postLogoutRedirectUri: window.location.origin,

            })

            user.value = null

            isAuthenticated.value = false

        } catch (error) {

            console.error('Logout failed:', error)

            throw error

        }

    }



    return {

        user,

        isAuthenticated,

        initialize,

        login,

        logout

    }

}) 
