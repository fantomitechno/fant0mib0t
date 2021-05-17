export const textLimiter = (string: string, limit: number, limiter: string = '...') => {
    return string.length > limit ? string.slice(0, limit) + limiter : string
}

export const countUpperCase = (string: string) => {
    return (string.match(/[A-Z]/g) || []).length
}