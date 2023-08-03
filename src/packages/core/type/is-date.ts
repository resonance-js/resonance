import { isNotNull } from './not-null';

export function isDate(val: any): val is Date {
    return isNotNull(val) && typeof val.getDate === 'function';
}
