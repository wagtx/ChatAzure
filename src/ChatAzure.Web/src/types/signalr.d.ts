declare module '@microsoft/signalr' {

    export interface HubConnection {

        start(): Promise<void>;

        stop(): Promise<void>;

        on(methodName: string, callback: (...args: any[]) => void): void;

        invoke(methodName: string, ...args: any[]): Promise<any>;

        serverTimeoutInMilliseconds: number;

        keepAliveIntervalInMilliseconds: number;

    }



    export interface HubConnectionBuilder {

        withUrl(url: string, options?: any): HubConnectionBuilder;

        withAutomaticReconnect(retryDelays?: number[]): HubConnectionBuilder;

        configureLogging(logging: any): HubConnectionBuilder;

        build(): HubConnection;

    }



    export class HttpTransportType {

        static WebSockets: number;

        static ServerSentEvents: number;

        static LongPolling: number;

    }

} 
