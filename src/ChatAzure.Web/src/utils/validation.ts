export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export function validatePassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return re.test(password)
}

export function validateUsername(username: string): boolean {
    // 3-20 characters, letters, numbers, underscores, hyphens
    const re = /^[a-zA-Z0-9_-]{3,20}$/
    return re.test(username)
} 