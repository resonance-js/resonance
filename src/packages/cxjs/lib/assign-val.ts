export function assignVal<T extends object, K extends keyof T>(
    obj: T,
    key: K,
    val: (typeof obj)[K]
): T {
    obj[key] = val;
    return obj;
}
