export function isNotNull<T>(val: T): val is NonNullable<T> {
    return val !== null && val !== undefined;
}
