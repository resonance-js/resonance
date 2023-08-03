export function deepCopy<T = any>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}
