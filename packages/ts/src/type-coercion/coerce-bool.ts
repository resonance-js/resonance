import { isNonNullable } from '../type/nullable';

export function coerceBool<T>(val: T): boolean | null;

export function coerceBool<T>(val: T, defaultVal: boolean): boolean;

export function coerceBool<T>(val: T, defaultVal?: boolean): any {
    if (isNonNullable(val))
        switch (typeof val) {
            case 'boolean':
                return val;
            case 'string':
                return val === 'true';
            case 'number':
                return val > 0;
        }
    if (isNonNullable(defaultVal)) return defaultVal;
    return null;
}
