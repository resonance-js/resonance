import { isNonNullable } from '../../../cxjs/lib/conditionals/is-non-nullable';

export function isDate(val: any): val is Date {
    return isNonNullable(val) && typeof val.getDate === 'function';
}
