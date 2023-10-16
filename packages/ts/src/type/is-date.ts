import { isNonNullable } from './nullable';

export function isDate(val: any): val is Date {
    return isNonNullable<Date>(val) && typeof val.getDate === 'function';
}
