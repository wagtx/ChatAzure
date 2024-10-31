export class AppError extends Error {

    constructor(

        message: string,

        public code: string,

        public retryable: boolean = false

    ) {

        super(message)

        this.name = 'AppError'

    }

}



export function isAppError(error: unknown): error is AppError {

    return error instanceof AppError

}



export function handleError(error: unknown): AppError {

    if (isAppError(error)) {

        return error

    }

    

    if (error instanceof Error) {

        return new AppError(error.message, 'UNKNOWN_ERROR')

    }

    

    return new AppError('An unknown error occurred', 'UNKNOWN_ERROR')

} 
