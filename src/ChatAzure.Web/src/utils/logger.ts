type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: unknown;
}

class Logger {
    private readonly appInsights: any

    constructor() {
        // Initialize Application Insights if available
        if (import.meta.env.PROD) {
            this.appInsights = window.appInsights
        }
    }

    debug(message: string, data?: unknown) {
        this.log('debug', message, data)
    }

    info(message: string, data?: unknown) {
        this.log('info', message, data)
    }

    warn(message: string, data?: unknown) {
        this.log('warn', message, data)
    }

    error(message: string, data?: unknown) {
        this.log('error', message, data)
    }

    private log(level: LogLevel, message: string, data?: unknown) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            data
        }

        if (import.meta.env.DEV) {
            console[level](entry)
        }

        if (this.appInsights) {
            if (level === 'error') {
                this.appInsights.trackException({ error: new Error(message), properties: data })
            } else {
                this.appInsights.trackTrace({ message, severity: level, properties: data })
            }
        }
    }
}

export const logger = new Logger() 