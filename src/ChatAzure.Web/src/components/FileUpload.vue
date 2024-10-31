<template>



  <div class="relative">



    <input



      type="file"



      ref="fileInput"



      class="hidden"



      @change="handleFileSelect"



      :accept="acceptedTypes"



      :multiple="allowMultiple"



    />



    



    <button



      @click="triggerFileInput"



      class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"



      :disabled="uploading"



    >



      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">



        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />



      </svg>



      <span>{{ uploading ? 'Uploading...' : 'Attach File' }}</span>



    </button>







    <div v-if="files.length > 0" class="mt-2 space-y-2">



      <div



        v-for="file in files"



        :key="file.name"



        class="flex items-center justify-between p-2 bg-gray-50 rounded"



      >



        <span class="truncate max-w-xs">{{ file.name }}</span>



        <div class="flex items-center space-x-2">



          <span v-if="file.progress !== undefined" class="text-sm text-gray-500">



            {{ file.progress }}%



          </span>



          <button 



            @click="removeFile(file)"



            class="text-red-500 hover:text-red-700"



            :disabled="uploading"



          >



            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">



              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />



            </svg>



          </button>



        </div>



      </div>



    </div>



  </div>



</template>







<script setup lang="ts">



import { ref } from 'vue'



import { storageService } from '@/services/storage'







interface FileWithProgress extends File {



  progress?: number;



  url?: string;



}







const props = defineProps({



  acceptedTypes: {



    type: String,



    default: '*/*'



  },



  allowMultiple: {



    type: Boolean,



    default: false



  },



  maxSize: {



    type: Number,



    default: 5 * 1024 * 1024 // 5MB



  }



})







const emit = defineEmits(['filesSelected', 'uploadComplete', 'error'])







const fileInput = ref<HTMLInputElement | null>(null)



const files = ref<FileWithProgress[]>([])



const uploading = ref(false)







const triggerFileInput = () => {



  fileInput.value?.click()



}







const handleFileSelect = async (event: Event) => {



  const input = event.target as HTMLInputElement



  if (!input.files?.length) return







  const selectedFiles = Array.from(input.files)



  const validFiles = selectedFiles.filter(file => file.size <= props.maxSize)







  if (validFiles.length !== selectedFiles.length) {



    emit('error', new Error('Some files exceed the maximum size limit'))



  }







  files.value = props.allowMultiple ? [...files.value, ...validFiles] : [validFiles[0]]



  emit('filesSelected', files.value)







  try {



    uploading.value = true



    const uploadPromises = files.value.map(async (file) => {



      try {



        const url = await storageService.uploadFile(file)



        file.url = url



        return url



      } catch (error) {



        emit('error', error)



        return null



      }



    })







    const urls = (await Promise.all(uploadPromises)).filter(Boolean)



    emit('uploadComplete', urls)



  } catch (error) {



    emit('error', error)



  } finally {



    uploading.value = false



  }



}







const removeFile = async (file: FileWithProgress) => {



  if (file.url) {



    try {



      await storageService.deleteFile(file.url)



    } catch (error) {



      emit('error', error)



    }



  }



  



  files.value = files.value.filter(f => f !== file)



  emit('filesSelected', files.value)



}



</script> 


