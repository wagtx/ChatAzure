export interface ChatMessage {



    messageId: string;



    sessionId: string;



    content: string;



    timestamp: string;



    sender: {



        id: string;



        type: 'user' | 'bot';



    };



    metadata: {



        clientInfo?: {



            platform: string;



            version: string;



        };



        customData?: Record<string, unknown>;



    };



}







export interface ChatSession {



    sessionId: string;



    userId: string;



    startTime: string;



    lastActiveTime: string;



    messages: ChatMessage[];



    context: {



        customizationRules: Record<string, unknown>;



        userPreferences: Record<string, unknown>;



        activeFeatures: string[];



    };



}







export interface ErrorResponse {



    errorCode: string;



    message: string;



    correlationId: string;



    timestamp: string;



    severity: 'warning' | 'error' | 'critical';



    retryable: boolean;



    suggestedAction?: string;



} 


