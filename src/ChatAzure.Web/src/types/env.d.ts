/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_AZURE_CLIENT_ID: string;
    readonly VITE_AZURE_TENANT_ID: string;
    readonly VITE_APP_INSIGHTS_KEY: string;
    readonly VITE_ENVIRONMENT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}






