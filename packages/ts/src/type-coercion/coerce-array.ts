import { isNonNullable } from '../type';

export const coerceArray = <T>(data?: T | T[]): T[] =>
    isNonNullable(data) ? (Array.isArray(data) ? data : [data]) : ([] as T[]);
