export function isNonNullObject<T>(val: unknown): val is NonNullable<T> {
    return val !== undefined && val !== null && typeof val === 'object';
}
