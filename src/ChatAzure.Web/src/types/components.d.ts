import { DefineComponent } from 'vue'

import { ErrorBoundary } from '@/components/ErrorBoundary.vue'

import { FileUpload } from '@/components/FileUpload.vue'

import { ChatWindow } from '@/components/ChatWindow.vue'

import { AuthProvider } from '@/components/AuthProvider.vue'



declare module '@vue/runtime-core' {

    export interface GlobalComponents {

        ErrorBoundary: typeof ErrorBoundary;

        FileUpload: typeof FileUpload;

        ChatWindow: typeof ChatWindow;

        AuthProvider: typeof AuthProvider;

    }

}



export {} 
