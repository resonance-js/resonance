import { isNonNullable } from './is-non-nullable';

export function isNonNullObject<T>(val: unknown): val is NonNullable<T> {
    return isNonNullable(val) && typeof val === 'object';
}
