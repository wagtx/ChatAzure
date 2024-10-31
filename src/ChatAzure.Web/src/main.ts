import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'

import router from './router'

import { logger } from './utils/logger'

import './assets/main.css'



// Initialize Application Insights

if (import.meta.env.PROD) {

    const appInsights = new ApplicationInsights({

        config: {

            instrumentationKey: import.meta.env.VITE_APP_INSIGHTS_KEY,

            enableAutoRouteTracking: true,

        }

    });

    appInsights.loadAppInsights();

    appInsights.trackPageView();

}



const app = createApp(App)



// Global error handler

app.config.errorHandler = (err, vm, info) => {

    logger.error('Global error:', { error: err, info })

    throw err

}



app.use(createPinia())

app.use(router)



app.mount('#app')


