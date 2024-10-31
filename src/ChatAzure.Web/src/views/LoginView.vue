<template>

  <div class="min-h-screen flex items-center justify-center bg-gray-100">

    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">

      <div>

        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">

          Sign in to ChatAzure

        </h2>

      </div>

      <div class="mt-8">

        <button

          @click="handleLogin"

          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

        >

          Sign in with Microsoft Account

        </button>

      </div>

    </div>

  </div>

</template>



<script setup lang="ts">

import { useRouter, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'



const router = useRouter()

const route = useRoute()

const authStore = useAuthStore()



const handleLogin = async () => {

  try {

    await authStore.login()

    const redirectPath = (route.query.redirect as string) || '/'

    router.push(redirectPath)

  } catch (error) {

    console.error('Login failed:', error)

  }

}

</script> 
