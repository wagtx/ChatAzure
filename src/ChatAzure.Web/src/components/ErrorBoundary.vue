<template>



  <div v-if="error" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">



    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">



      <h3 class="text-xl font-bold text-red-600 mb-4">Error</h3>



      <p class="text-gray-700 mb-4">{{ error.message }}</p>



      <div class="flex justify-end space-x-4">



        <button @click="retry" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">



          Retry



        </button>



        <button @click="reset" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">



          Dismiss



        </button>



      </div>



    </div>



  </div>



  <slot v-else></slot>



</template>







<script setup lang="ts">



import { ref } from 'vue'







const error = ref(null)



const lastAction = ref(null)







const handleError = (e: Error, action?: () => Promise<void>) => {



  error.value = e



  if (action) {



    lastAction.value = action



  }



}







const retry = async () => {



  if (lastAction.value) {



    error.value = null



    try {



      await lastAction.value()



    } catch (e) {



      error.value = e



    }



  }



}







const reset = () => {



  error.value = null



  lastAction.value = null



}







defineExpose({ handleError })



</script> 


