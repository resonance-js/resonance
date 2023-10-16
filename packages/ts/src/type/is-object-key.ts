export function isObjectKey<T>(val: unknown): val is keyof T {
    return (
        (val !== undefined && val !== null && typeof val === 'string') ||
        typeof val === 'symbol' ||
        typeof val === 'number'
    );
}
