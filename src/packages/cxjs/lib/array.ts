/**
 * Removes an element from an array and returns the modified array.
 * @param arr The array from which an element will be removed.
 * @param value The value that will be removed from the array.
 * @returns The array with the value removed. If the value cannot be found,
 * returns the original array.
 */
export function arrayRemove<T>(arr: T[], value: T) {
    const index = arr.indexOf(value);
    return arr.splice(index, 1);
}

/**
 * Adds `_index` key to each object in the array.
 * @param items The items to index.
 * @returns A
 */
export function indexArray<T>(...items: T[]) {
    return items.map((value, index): T => {
        try {
            (value as Record<string, any>)['_index'] = index;
        } catch {}

        return value;
    });
}

export function toArray<T>(data: any): T[] {
    if (Array.isArray(data)) return data;
    return [data];
}
