import { isNonNullable, isNullable } from '../type/nullable';

export function coerceString(val: unknown): string | null;

export function coerceString(val: unknown, defaultVal: string): string;

export function coerceString(val: unknown, defaultVal?: string): string | null {
    if (isNullable(val) && isNonNullable<string>(defaultVal)) return defaultVal;

    if (isNonNullable(val)) {
        if (Array.isArray(val)) return val.toString();

        switch (typeof val) {
            case 'string':
                return val;
            case 'number':
                return val.toString();
            case 'bigint':
                return val.toString();
            case 'boolean':
                return val + '';
            case 'function':
                return JSON.stringify(val);
            case 'object':
                return JSON.stringify(val);
            case 'symbol':
                return val.toString();
            default:
                return defaultVal ?? null;
        }
    }

    return null;
}
