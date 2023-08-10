export function objectArrayInsert<
    T extends Record<K, C>,
    K extends keyof T,
    C extends Array<V>,
    V = any
>(obj: T, key: K, val: V): T {
    if (obj[key] !== undefined) {
        obj[key].push(val);
    } else {
        obj[key] = [val] as T[K];
    }

    return obj;
}
