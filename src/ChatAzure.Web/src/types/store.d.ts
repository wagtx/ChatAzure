import { AccountInfo } from '@azure/msal-browser'

import { ChatMessage, ChatSession } from './chat'



export interface AuthState {

    user: AccountInfo | null;

    isAuthenticated: boolean;

    loading: boolean;

}



export interface ChatState {

    messages: ChatMessage[];

    sessions: ChatSession[];

    currentSession: ChatSession | null;

    loading: boolean;

    error: Error | null;

}



export interface UIState {

    darkMode: boolean;

    sidebarOpen: boolean;

    notifications: Notification[];

}



export interface Notification {

    id: string;

    type: 'success' | 'error' | 'warning' | 'info';

    message: string;

    timestamp: Date;

    read: boolean;

} 
