export function formatTime(timestamp: string | Date): string {

    const date = new Date(timestamp);

    return new Intl.DateTimeFormat('default', {

        hour: 'numeric',

        minute: 'numeric',

        hour12: true

    }).format(date);

}



export function formatDate(timestamp: string | Date): string {

    const date = new Date(timestamp);

    return new Intl.DateTimeFormat('default', {

        year: 'numeric',

        month: 'long',

        day: 'numeric'

    }).format(date);

}



export function formatRelativeTime(timestamp: string | Date): string {

    const date = new Date(timestamp);

    const now = new Date();

    const diff = now.getTime() - date.getTime();

    

    const minutes = Math.floor(diff / 60000);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);



    if (minutes < 1) return 'just now';

    if (minutes < 60) return `${minutes}m ago`;

    if (hours < 24) return `${hours}h ago`;

    if (days < 7) return `${days}d ago`;

    

    return formatDate(date);

} 
