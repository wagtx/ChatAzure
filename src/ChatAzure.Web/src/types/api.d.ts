export interface ApiResponse<T> {

    data: T;

    error?: string;

    metadata?: Record<string, unknown>;

}



export interface ApiError {

    code: string;

    message: string;

    details?: Record<string, unknown>;

}



export interface PaginatedResponse<T> {

    items: T[];

    totalCount: number;

    pageSize: number;

    pageNumber: number;

    hasMore: boolean;

} 
