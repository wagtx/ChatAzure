<template>



  <div v-if="loading" class="flex justify-center items-center h-screen">



    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>



  </div>



  <div v-else>



    <div v-if="!user" class="flex justify-center items-center h-screen">



      <div class="bg-white p-8 rounded-lg shadow-md">



        <h2 class="text-2xl font-bold mb-6">Sign In</h2>



        <button



          @click="signIn"



          class="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"



        >



          Sign in with Microsoft Account



        </button>



      </div>



    </div>



    <slot v-else :user="user" :signOut="signOut"></slot>



  </div>



</template>







<script setup lang="ts">



import { ref, onMounted } from 'vue'



import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser'







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



const user = ref(null)



const loading = ref(true)







const loginRequest = {



  scopes: ['User.Read', 'api://chatazure/chat.access']



}







async function signIn() {



  try {



    const result = await msalInstance.loginPopup(loginRequest)



    handleResponse(result)



  } catch (error) {



    console.error('Login failed:', error)



    throw error



  }



}







async function signOut() {



  try {



    await msalInstance.logoutPopup({



      postLogoutRedirectUri: window.location.origin,



    })



    user.value = null



  } catch (error) {



    console.error('Logout failed:', error)



    throw error



  }



}







function handleResponse(response: AuthenticationResult) {



  if (response !== null) {



    user.value = response.account



  } else {



    selectAccount()



  }



}







function selectAccount() {



  const currentAccounts = msalInstance.getAllAccounts()



  if (currentAccounts.length === 0) {



    return



  } else if (currentAccounts.length > 1) {



    console.warn('Multiple accounts detected, using first account')



  }



  user.value = currentAccounts[0]



}







onMounted(async () => {



  try {



    await msalInstance.handleRedirectPromise()



    selectAccount()



  } catch (error) {



    console.error('Error during authentication:', error)



  } finally {



    loading.value = false



  }



})



</script> 


