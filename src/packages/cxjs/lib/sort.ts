import { indexArray } from './array';

export enum SortDirection {
    NO_SORT,
    ASCENDING,
    DESCENDING
}

enum ArrSortDirection {
    A_LESS_THAN_B = -1,
    A_GREATER_THAN_B = 1,
    EQUAL = 0
}

/**
 * Sorts an array in place. This method mutates the array and returns a reference to the same array.
 * @param arr The array to sort.
 * @param key The key by which the array will be sorted.
 * @param sortDirection The direction in which the array should be sorted.
 * @returns The array, sorted by the key in descending order.
 */
function sort<T = any>(
    arr: T[],
    key: keyof T | '_index',
    sortDirection: SortDirection.ASCENDING | SortDirection.DESCENDING
) {
    return arr.sort((a: any, b: any) => {
        let aVal: any;
        let bVal: any;

        if (typeof a[key] === 'string' && a[key] !== null && b[key] !== null) {
            const isTime = /(\d\d:\d\d)$/.test(a[key]);

            if (isTime) {
                const aSplit = a[key].split(':');
                const bSplit = b[key].split(':');

                aVal =
                    Number.parseInt(aSplit[0], 10) * 60 +
                    Number.parseInt(aSplit[1], 10);
                bVal =
                    Number.parseInt(bSplit[0], 10) * 60 +
                    Number.parseInt(bSplit[1], 10);
            } else {
                // Just a plain 'ol string
                aVal = a[key];
                bVal = b[key];
            }
        } else if (a[key] === null || b[key] === null) {
            if (a[key] === null && b[key] === null) {
                return ArrSortDirection.EQUAL;
            } else if (a[key] === null) {
                return sortDirection === SortDirection.DESCENDING
                    ? ArrSortDirection.A_GREATER_THAN_B
                    : ArrSortDirection.A_LESS_THAN_B;
            } else if (b[key] === null) {
                return sortDirection === SortDirection.DESCENDING
                    ? ArrSortDirection.A_LESS_THAN_B
                    : ArrSortDirection.A_GREATER_THAN_B;
            }
        } else {
            // Something that'll sort itself, like a number
            aVal = a[key];
            bVal = b[key];
        }

        if (aVal === undefined && bVal !== undefined) {
            return ArrSortDirection.A_LESS_THAN_B;
        } else if (aVal !== undefined && bVal === undefined) {
            return ArrSortDirection.A_GREATER_THAN_B;
        } else if (aVal === undefined && bVal === undefined) {
            return ArrSortDirection.EQUAL;
        } else if (sortDirection === SortDirection.DESCENDING) {
            return aVal > bVal
                ? ArrSortDirection.A_GREATER_THAN_B
                : aVal < bVal
                ? ArrSortDirection.A_LESS_THAN_B
                : ArrSortDirection.EQUAL;
        } else {
            return aVal > bVal
                ? ArrSortDirection.A_LESS_THAN_B
                : aVal < bVal
                ? ArrSortDirection.A_GREATER_THAN_B
                : ArrSortDirection.EQUAL;
        }
    });
}

/**
 * Sorts an array in place in descending order. This method mutates the array
 * and returns a reference to the same array.
 * @param arr The array to sort.
 * @param key The key by which the array will be sorted.
 * @param indexArr Whether an `_index` field should be added to each item in the array
 * with its original sort position. Used to return arrays to their original sort order.
 * @returns The array, sorted by the key in descending order.
 */
export function sortDescending<T = any>(
    arr: T[],
    key: keyof T,
    indexArr = false
): T[] {
    if (indexArr) indexArray(arr);
    return sort(arr, key, SortDirection.DESCENDING);
}

/**
 * Sorts an array in ascending order in place. This method mutates the array
 * and returns a reference to the same array.
 * @param arr The array to sort.
 * @param key The key by which the array will be sorted.
 * @param indexArr Whether an `_index` field should be added to each item in the array
 * with its original sort position. Used to return arrays to their original sort order.
 * @returns The array, sorted by the key in ascending order.
 */
export function sortAscending<T = any>(
    arr: T[],
    key: keyof T,
    indexArr = false
): T[] {
    if (indexArr) indexArray(arr);
    return sort(arr, key, SortDirection.ASCENDING);
}

/**
 * Returns an indexed array to its original sort order, sorting it in place.
 * This method mutates the array and returns a reference to the same array.
 * @param arr The array to return to the original sort order.
 * @returns The indexed array, returned to its original sort order.
 * @note Sorts can only be cleared on indexed arrays. To index an array, either use
 * {@link index} or set `indexArr` to true on {@link sortAscending}
 * or {@link sortDescending}.
 */
export function sortClear<T = any>(arr: T[]): T[] {
    if (arr.length > 0 && (arr as any[])[0]['_index'] !== undefined) {
        return sort<T>(arr, '_index', SortDirection.DESCENDING);
    } else {
        console.error(
            new Error(
                'This array is not indexed, so we could not return it to original sort order.'
            )
        );
        return arr;
    }
}

export function index<T = any>(arr: T[]): T[] {
    arr.forEach((item: any, index) => (item['_index'] = index));
    return arr;
}
