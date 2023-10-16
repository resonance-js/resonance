import { isNonNullable } from '../type/nullable';

export function coerceNum<T>(val: T): number | null;

export function coerceNum<T>(val: T, defaultVal: number): number;

export function coerceNum<T>(val: T, defaultVal?: number): any {
    if (isNonNullable(val))
        switch (typeof val) {
            case 'number':
                return val;
            case 'string':
                const number = Number.parseInt(val);
                if (!Number.isNaN(number)) return number;
        }
    if (isNonNullable(defaultVal)) return defaultVal;
    return null;
}
