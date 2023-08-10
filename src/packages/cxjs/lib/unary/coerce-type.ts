import { isNonNullable } from '../conditionals';

export function coerceBool<T>(val: T, defaultVal?: boolean): boolean | null {
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

export function coerceString<T>(val: T, defaultVal?: string): string | null {
    if (isNonNullable(val))
        switch (typeof val) {
            case 'string':
                return val;
            default:
                return val + '';
        }
    if (isNonNullable(defaultVal)) return defaultVal;
    return null;
}

export function coerceNum<T>(val: T, defaultVal?: number): number | null {
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
