<template>

  <AuthProvider>

    <template #default="{ user, signOut }">

      <div class="min-h-screen bg-gray-100">

        <nav class="bg-white shadow">

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="flex justify-between h-16">

              <div class="flex">

                <div class="flex-shrink-0 flex items-center">

                  <h1 class="text-xl font-bold text-gray-900">ChatAzure</h1>

                </div>

              </div>

              <div class="flex items-center">

                <span class="text-gray-700 mr-4">{{ user.name }}</span>

                <button

                  @click="signOut"

                  class="bg-gray-100 p-2 rounded-md text-gray-700 hover:bg-gray-200"

                >

                  Sign Out

                </button>

              </div>

            </div>

          </div>

        </nav>

        <main>

          <router-view />

        </main>

      </div>

    </template>

  </AuthProvider>

</template>



<script setup lang="ts">

import AuthProvider from './components/AuthProvider.vue'

</script> 
